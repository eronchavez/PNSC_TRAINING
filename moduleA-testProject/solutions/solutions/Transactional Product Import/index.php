<?php
declare(strict_types=1);
require __DIR__ . '/src/Database.php';
require __DIR__ . '/src/ProductImporter.php';

$pdo = Database::connect();
$result = null;
$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($_FILES['products']) || $_FILES['products']['error'] !== UPLOAD_ERR_OK) {
            throw new ImportValidationException('Select a readable CSV file.');
        }
        if ($_FILES['products']['size'] > 1024 * 1024) {
            throw new ImportValidationException('The upload must not exceed 1 MiB.');
        }
        $stream = fopen($_FILES['products']['tmp_name'], 'rb');
        if ($stream === false) {
            throw new ImportValidationException('The upload could not be opened.');
        }
        try {
            $result = (new ProductImporter($pdo))->import($stream);
        } finally {
            fclose($stream);
        }
    } catch (ImportValidationException $exception) {
        $error = $exception->getMessage();
    } catch (Throwable) {
        $error = 'The import could not be completed.';
    }
}
$products = $pdo->query('SELECT sku, name, price_cents, stock, updated_at FROM products ORDER BY sku')->fetchAll();
function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
?>
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Transactional Product Import</title></head>
<body><nav class="task-nav"><h1>Transactional Product Import</h1>
<p>Upload a CSV with the exact header <code>sku,name,price,stock</code>. The complete file is validated before one atomic write transaction begins.</p></header>
<?php if ($result): ?><p class="notice success" role="status">Imported <?= $result['processed'] ?> rows: <?= $result['created'] ?> created and <?= $result['updated'] ?> updated.</p><?php endif ?>
<?php if ($error): ?><p class="notice error" role="alert"><?= e($error) ?></p><?php endif ?>
<section class="panel"><h2>Import file</h2><form method="post" enctype="multipart/form-data">
<div class="field"><label for="products">Product CSV (maximum 1 MiB / 500 rows)</label><input id="products" name="products" type="file" accept=".csv,text/csv" required></div>
<div class="actions"><button type="submit">Validate and import</button><a href="sample/products.csv">Download sample CSV</a></div>
</form></section>
<section class="panel"><h2>Current catalogue</h2><div class="table-wrap"><table><thead><tr><th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Updated</th></tr></thead><tbody>
<?php foreach ($products as $product): ?><tr><td><code><?= e($product['sku']) ?></code></td><td><?= e($product['name']) ?></td><td>₱<?= number_format($product['price_cents'] / 100, 2) ?></td><td><?= (int) $product['stock'] ?></td><td><?= e($product['updated_at']) ?></td></tr><?php endforeach ?>
</tbody></table></div></section></main></body></html>
