@iframe([
  'src' => 'https://www.w3schools.com',
	'title' => 'Startsidan på helsingborg.se',
	'width' => 800,
	'height' => 600,
	'labels' => [
		'knownLabels' => (object) [
			'title' => 'This is the title of a known website ({SUPPLIER_WEBSITE}). You can find their policy here: {SUPPLIER_POLICY}.',
			'info' => 'This is the information that is shown describing what accepting means.',
			'button' => 'accept'
		],
		'unknownLabels' => (object) [
			'title' => 'This is the content of a unknown website ({SUPPLIER_WEBSITE}).',
			'info' => 'This is the information that is shown describing what accepting means.',
			'button' => 'accept'
		]
	],
])
@endiframe
