@acceptance([
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
    "height"    => '500',
    "src"       => 'https://helsingborg.maps.arcgis.com/apps/Embed/index.html?webmap=5e2a37ce1fe649f78889205f484caafb&amp;extent=12.7047,56.0333,12.73,56.041&amp;home=true&amp;zoom=true&amp;scale=true&amp;search=true&amp;searchextent=false&amp;basemap_gallery=true&amp;disable_scroll=false&amp;theme=light',
    "policy"    => 'https://google.com/policy',
    "host"      => 'google.com',
    "name"      => 'Google',
])
    Hey! This should be a map!
@endacceptance