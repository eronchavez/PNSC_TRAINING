<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/Database.php';
require dirname(__DIR__) . '/src/ProductImporter.php';

$failures = 0;
function check(bool $condition, string $message): void {
    global $failures;
    echo ($condition ? "PASS" : "FAIL") . " - $message\n";
    if (!$condition) $failures++;
}
function csvStream(string $csv) {
    $stream = fopen('php://temp', 'w+b');
    fwrite($stream, $csv);
    rewind($stream);
    return $stream;
}

$path = sys_get_temp_dir() . '/c4-' . bin2hex(random_bytes(5)) . '.sqlite';
$pdo = Database::connect($path, false);
$pdo->exec("INSERT INTO products (sku,name,price_cents,stock,updated_at) VALUES ('KEY-100','Old',100,1,'old')");
$importer = new ProductImporter($pdo);
$summary = $importer->import(csvStream("sku,name,price,stock\nKEY-100,\"Keyboard, TKL\",19.90,5\nHUB-700,USB Hub,7.05,3\n"));
check($summary === ['created' => 1, 'updated' => 1, 'processed' => 2], 'mixed import reports exact counts');
$row = $pdo->query("SELECT price_cents,stock FROM products WHERE sku='KEY-100'")->fetch();
check((int)$row['price_cents'] === 1990 && (int)$row['stock'] === 5, 'money uses exact cents and existing row updates');
$before = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
try {
    $importer->import(csvStream("sku,name,price,stock\nNEW-1,Valid,10.00,2\nBAD!,Broken,4.00,1\n"));
    check(false, 'invalid file is rejected');
} catch (ImportValidationException) {
    check((int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn() === $before, 'invalid file makes no database changes');
}
try {
    $importer->import(csvStream("sku,name,price,stock\nDUP-1,First,1.00,1\nDUP-1,Second,2.00,2\n"));
    check(false, 'duplicate SKU is rejected');
} catch (ImportValidationException) {
    check((int)$pdo->query("SELECT COUNT(*) FROM products WHERE sku='DUP-1'")->fetchColumn() === 0, 'duplicate file SKU rolls back all work');
}
@unlink($path);
exit($failures === 0 ? 0 : 1);
