<div style="position: relative;">
@acceptance([
    'labels' => [
		'knownLabels' => [
			'title' => 'This is the title of a known website ({SUPPLIER_WEBSITE}). You can find their policy here: {SUPPLIER_POLICY}.',
			'info' => 'This is the information that is shown describing what accepting means.',
			'button' => 'accept'
		],
		'unknownLabels' => [
			'title' => 'This is the content of a unknown website ({SUPPLIER_WEBSITE}).',
			'info' => 'This is the information that is shown describing what accepting means.',
			'button' => 'accept'
		]
	],
    "modifier"  => 'video',
    "height"    => '500',
    "src"       => ['https://www.youtube.com/watch?v=axiYo61XRRw'],
    "classList" => ['u-ratio-16-9']
])
    Hey! this is the content blocked. Javascript will not run until acceptance is received.
@endacceptance
</div>