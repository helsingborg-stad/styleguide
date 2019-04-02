<?php

if(defined('WP_CLI') && WP_CLI) {
    define('DB_NAME', 'hbgprime');
    define('DB_USER', 'root');
    define('DB_PASSWORD', 'root');
    define('DB_HOST', '127.0.0.1');
} else {
    define('DB_NAME', getenv('DATABASE_NAME'));
    define('DB_USER', getenv('DATABASE_USERNAME'));
    define('DB_PASSWORD', getenv('DATABASE_PASSWORD'));
    define('DB_HOST', getenv('DATABASE_HOST'));
}

define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = '';
