<?php
// db.php - MySQLi connection for ToDo project

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');        // dein MariaDB User
define('DB_PASS', 'root');        // dein Passwort
define('DB_NAME', 'todo_db');
define('DB_PORT', 3306);

// Create connection
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($mysqli->connect_errno) {
    die("DB connection failed: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

// Set charset to UTF-8
$mysqli->set_charset('utf8mb4');
