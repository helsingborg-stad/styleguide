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

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );
$endpoint = strtolower($uri[1]);



if($endpoint == 'topnav' && isset($_GET['pageID'])){

	$parentID = $_GET['pageID'];
	$response = null;

	switch ($parentID) {
		case '1':
			$response = [
				'title' => 'About',
				'href' => '#1',
				'items' => [
					[	
						'label' => 'Item',
						'href' => '#',
						'id' => 12
					],
					[	
						'label' => 'Item 2',
						'href' => '#',
						'id' => 133
					],
					[	
						'label' => 'Item 3',
						'href' => '#',
						'id' => 134
					]
				]
			];
			break;
		case '2':
			$response = [
				'title' => 'Stuff',
				'href' => '#2',
				'items' => [[	
					'label' => 'Thing',
					'href' => '#',
					'id' => 13,
					'preview' => 'This is a preview...'
				]]
			];
			break;
		case '3':
			$response = [
				'title' => 'More',
				'href' => '#3',
				'items' => [[	
					'label' => 'Stuff',
					'href' => '#',
					'id' => 14,
					'preview' => 'This is a preview...'
				]]
			];
			break;
		default:
			$response = null;
	}

	

	header('Content-Type: application/json');
	echo json_encode($response);
	die();
}

$viewPaths = [BASEPATH . 'views'];
$bladeService = (new ComponentLibraryInit($viewPaths))->getEngine();
new App($bladeService);
