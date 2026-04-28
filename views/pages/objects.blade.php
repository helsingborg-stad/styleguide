@extends('layout.containers.doc')

@section('doc-hero')
	@include('layout.partials.doc-hero', [
		'title' => 'Objects',
		'subtitle' => 'Global CSS objects that can be used anywhere with plain HTML. No component syntax required.',
		'metaTags' => [
			['label' => 'Plain HTML classes'],
			['label' => 'Layout & UI primitives']
		],
		'primaryCta' => ['label' => 'Browse objects', 'href' => '/objects/grid'],
		'secondaryCta' => ['label' => 'View grid object', 'href' => '/objects/grid'],
		'shortcuts' => [
			['label' => 'Grid', 'href' => '/objects/grid'],
			['label' => 'Container', 'href' => '/objects/container'],
			['label' => 'Tooltip', 'href' => '/objects/tooltip'],
			['label' => 'Minimal Slider', 'href' => '/objects/minimal-slider'],
		],
	])
@endsection

@section('doc-content')
	@typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
		Objects
	@endtypography
	@typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
		Browse all available objects.
	@endtypography

	@if (!empty($objectsOverviewItems ?? []))
		<div class="o-grid">
			@foreach (($objectsOverviewItems ?? []) as $objectOverviewItem)
				<div class="o-grid-12@xs o-grid-6@sm o-grid-4@md">
					@box([
						'heading' => $objectOverviewItem['name'] ?? '',
						'content' => $objectOverviewItem['description'] ?? '',
						'link' => $objectOverviewItem['href'] ?? '#',
						'icon' => $objectOverviewItem['icon'] ?? 'category',
					])
					@endbox
				</div>
			@endforeach
		</div>
	@else
		@notice([
			'type' => 'warning',
			'message' => ['text' => 'No objects are available right now.']
		])
		@endnotice
	@endif
@stop
