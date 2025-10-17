<?php

// db.php - MySQLi connection for toDo
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'todo_db');
define('DB_PORT', 3306);

// Create connection
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($mysqli->connect_error) {
    die("MySQL DB connection failed: (" . $mysqli->connect_error . ") " . $mysqli->connect_error);
}

// Set charset to UTF-8
// $mysqli->set_charset('utf8mb4');
