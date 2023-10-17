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
    "src"       => 'https://google.com',
    "policy"    => 'https://google.com/policy',
    "host"      => 'google.com',
    "name"      => 'Google',
])
    Hey! this is the content blocked. Javascript will not run until acceptance is received.
@endacceptance