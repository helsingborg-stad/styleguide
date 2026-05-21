@timeline([
	'sequential' => true,
	'events' => [
		[
			'title' => 'Collect requirements',
			'content' => 'Gather the content, ordering, and interaction rules that the timeline should support.',
		],
		[
			'title' => 'Build the showcase',
			'content' => 'Add examples and local styles so the component can be reviewed and iterated inside the styleguide.',
			'active_step' => true,
		],
		[
			'title' => 'Validate the output',
			'content' => 'Run the local checks and confirm the component appears correctly in the documentation site.',
		],
	],
])
@endtimeline
