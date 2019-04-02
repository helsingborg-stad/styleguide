<?php

//Enable/disable all errors
if (false) {
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
}

//Run application
require_once 'Bootstrap.php';
new \HbgStyleGuide\App();
