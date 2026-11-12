<?php

// Path to views directory
define('VIEWS_PATH', BASEPATH . 'views/');
define('CACHE_PATH', BASEPATH . 'cache/');
define('LOCAL_DOMAIN', '.local');

// Placeholder image service used by style-guide examples. Change this value (or
// set STYLEGUIDE_IMAGE_PROVIDER before this file is loaded) when a provider is
// unavailable. Supported values: image-api, placebear, imgipsum, and picsum.
if (!defined('STYLEGUIDE_IMAGE_PROVIDER')) {
    define('STYLEGUIDE_IMAGE_PROVIDER', getenv('STYLEGUIDE_IMAGE_PROVIDER') ?: 'image-api');
}
