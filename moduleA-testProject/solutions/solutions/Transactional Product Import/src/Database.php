<?php
declare(strict_types=1);

final class Database
{
    public static function connect(?string $path = null, bool $seed = true): PDO
    {
        $path ??= dirname(__DIR__) . '/storage/catalogue.sqlite';
        $directory = dirname($path);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create the storage directory.');
        }

        $pdo = new PDO('sqlite:' . $path, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON');
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sku TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
                stock INTEGER NOT NULL CHECK (stock >= 0),
                updated_at TEXT NOT NULL
            )'
        );
        if ($seed && (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn() === 0) {
            $stmt = $pdo->prepare(
                'INSERT INTO products (sku, name, price_cents, stock, updated_at)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $now = gmdate('Y-m-d\TH:i:s\Z');
            $stmt->execute(['KEY-100', 'Mechanical Keyboard', 359900, 7, $now]);
            $stmt->execute(['MOUSE-20', 'Wireless Mouse', 149950, 14, $now]);
        }
        return $pdo;
    }
}
