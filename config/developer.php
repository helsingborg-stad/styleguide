<?php

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */

// Activate debug mode
define('WP_DEBUG', isset($_GET['debug']) ? true : false);

define('DEV_MODE', true);

/**
 * Use memcached.
 * @var bool
 */
if(!defined('WP_USE_MEMCACHED')) {
    define('WP_USE_MEMCACHED', false);
}

/**
 * Use redis?.
 * @var bool
 */
if(!defined('WP_REDIS_DISABLED')) {
    define('WP_REDIS_DISABLED', true);
}
