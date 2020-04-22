<?php

//Enable/disable all errors
if (isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
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

//Run application
require_once 'Bootstrap.php';
new \HbgStyleGuide\App();

