<?php

//Enable/disable all errors
if (isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

if(isset($_GET['parentID'])){

	$data = [
		[	
			"ID"=> 24963,
			"post_parent" => 6978,
			"post_title" => "Test",
			"href" => "#",
			"children" => false
		]
	];

	header('Content-Type: application/json');
	echo json_encode($data);
	die();
}

//Run application
require_once 'Bootstrap.php';
new \HbgStyleGuide\App();
