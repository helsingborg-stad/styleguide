<?php

//Enable/disable all errors
if (isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

//Run application
require_once 'Bootstrap.php';
new \HbgStyleGuide\App();
