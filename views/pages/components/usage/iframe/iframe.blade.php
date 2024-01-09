@iframe([
  'src' => 'https://ettbattre.helsingborg.se/',
	'title' => 'Ett bättre Helsingborg Application',
	'width' => '100%',
	'height' => 600,
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
])
@endiframe

@typography([
	'variant' => "h3",
	'element' => "h3",
	'u-margin__bottom' => 0
])
	Automatic height detection
@endtypography

@code(['language' => 'js', 'content' => "You may enable the iframe component to automatically adapt the height to the iframe content by embedding the following script into the framed content."])
<script>
	if(window.location !== window.parent.location) {
		document.querySelector("html, body").style.height = "auto";
		const sendMessageToParent = () => {
			window.parent.postMessage({
				height: document.body.clientHeight
			}, '*');
		};sendMessageToParent();
		new ResizeObserver(() => {
			sendMessageToParent();
		}).observe(document.body);
	}
</script>
@endcode