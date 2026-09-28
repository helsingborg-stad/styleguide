<?php

//Enable/disable all errors
use ComponentLibrary\Init as ComponentLibraryInit;
use MunicipioStyleGuide\App;
use MunicipioStyleGuide\Asset;

if (isset($_GET['debug'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

if (!function_exists('__')) {
    function __($text, $domain = 'default')
    {
        return $text;
    }
}

define('BASEPATH', dirname(__FILE__) . '/');
require_once BASEPATH . 'config.php';
require_once __DIR__ . '/vendor/autoload.php';
require BASEPATH . 'Public.php';

$viewPaths = [BASEPATH . 'views', BASEPATH];
$assetEnqueuer = Asset::createEnqueuer();
$bladeService = (new ComponentLibraryInit($viewPaths, $assetEnqueuer))->getEngine();
$app = new App($bladeService, $assetEnqueuer);
$app->run();
