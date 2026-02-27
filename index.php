<?php

//Enable/disable all errors
use ComponentLibrary\Init as ComponentLibraryInit;
use HbgStyleGuide\App;

if (isset($_GET['debug'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

define('BASEPATH', dirname(__FILE__) . '/');
require_once BASEPATH . 'config.php';
require_once __DIR__ . '/vendor/autoload.php';
require BASEPATH . 'Public.php';

$viewPaths = [BASEPATH . 'views'];
$bladeService = (new ComponentLibraryInit($viewPaths))->getEngine();
$app = new App($bladeService);
$app->run();
