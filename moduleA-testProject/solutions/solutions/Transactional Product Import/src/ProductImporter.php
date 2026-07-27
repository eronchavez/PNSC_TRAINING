<?php
declare(strict_types=1);

final class ImportValidationException extends RuntimeException {}

final class ProductImporter
{
    public function __construct(private PDO $pdo) {}

    /** @param resource $stream */
    public function import($stream): array
    {
        if (!is_resource($stream)) {
            throw new InvalidArgumentException('A readable CSV stream is required.');
        }

        $header = fgetcsv($stream);
        if ($header === false) {
            throw new ImportValidationException('The CSV is empty.');
        }
        $header = array_map(static fn($value) => trim((string) $value), $header);
        if ($header !== ['sku', 'name', 'price', 'stock']) {
            throw new ImportValidationException('The exact header must be sku,name,price,stock.');
        }

        $rows = [];
        $seen = [];
        $line = 1;
        while (($values = fgetcsv($stream)) !== false) {
            $line++;
            if ($values === [null] || (count($values) === 1 && trim((string) $values[0]) === '')) {
                continue;
            }
            if (count($rows) >= 500) {
                throw new ImportValidationException('Line ' . $line . ': the 500-row limit was exceeded.');
            }
            if (count($values) !== 4) {
                throw new ImportValidationException('Line ' . $line . ': expected exactly four columns.');
            }
            [$sku, $name, $price, $stock] = array_map(static fn($value) => trim((string) $value), $values);
            if (!preg_match('/^[A-Z0-9-]{3,20}$/', $sku)) {
                throw new ImportValidationException('Line ' . $line . ': SKU must contain 3-20 uppercase letters, digits, or hyphens.');
            }
            $nameLength = mb_strlen($name);
            if ($nameLength < 2 || $nameLength > 80 || !mb_check_encoding($name, 'UTF-8')) {
                throw new ImportValidationException('Line ' . $line . ': name must be valid UTF-8 with 2-80 characters.');
            }
            if (isset($seen[$sku])) {
                throw new ImportValidationException('Line ' . $line . ': duplicate SKU ' . $sku . ' in this file.');
            }
            if (!preg_match('/^\d+(?:\.\d{1,2})?$/', $price)) {
                throw new ImportValidationException('Line ' . $line . ': price must be a non-negative decimal with at most two fractional digits.');
            }
            if (!preg_match('/^\d+$/', $stock) || (int) $stock > 1000000) {
                throw new ImportValidationException('Line ' . $line . ': stock must be an integer from 0 to 1000000.');
            }
            $seen[$sku] = true;
            $rows[] = [
                'sku' => $sku,
                'name' => $name,
                'price_cents' => $this->moneyToCents($price),
                'stock' => (int) $stock,
            ];
        }
        if ($rows === []) {
            throw new ImportValidationException('The CSV has no product rows.');
        }

        $exists = $this->pdo->prepare('SELECT 1 FROM products WHERE sku = ?');
        $upsert = $this->pdo->prepare(
            'INSERT INTO products (sku, name, price_cents, stock, updated_at)
             VALUES (:sku, :name, :price_cents, :stock, :updated_at)
             ON CONFLICT(sku) DO UPDATE SET
                name = excluded.name,
                price_cents = excluded.price_cents,
                stock = excluded.stock,
                updated_at = excluded.updated_at'
        );
        $created = 0;
        $updated = 0;
        $this->pdo->beginTransaction();
        try {
            foreach ($rows as $row) {
                $exists->execute([$row['sku']]);
                $exists->fetchColumn() ? $updated++ : $created++;
                $upsert->execute($row + ['updated_at' => gmdate('Y-m-d\TH:i:s\Z')]);
            }
            $this->pdo->commit();
        } catch (Throwable $error) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $error;
        }
        return ['created' => $created, 'updated' => $updated, 'processed' => count($rows)];
    }

    private function moneyToCents(string $price): int
    {
        [$whole, $fraction] = array_pad(explode('.', $price, 2), 2, '');
        $fraction = str_pad($fraction, 2, '0');
        if (strlen($whole) > 9) {
            throw new ImportValidationException('Price is too large.');
        }
        return ((int) $whole * 100) + (int) $fraction;
    }
}
