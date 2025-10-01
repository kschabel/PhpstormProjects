<?php
// PDO connection to SQLite (not MySQL!)
$PDO = new PDO('sqlite:' . __DIR__ . '/formInputs.sqlite');
$PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create table if not exists
$PDO->exec("
    CREATE TABLE IF NOT EXISTS formInputs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        time TEXT NOT NULL
    )
");
?>

