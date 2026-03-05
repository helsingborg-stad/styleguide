@extends('layout.containers.doc')

@section('doc-hero')
	@include('layout.partials.doc-hero', [
		'title' => 'Component library',
		'subtitle' => 'Browse components with ready-made markup and guidance.',
		'metaTags' => [
			['label' => 'Flat component navigation'],
			['label' => 'Reusable Blade components']
		],
		'primaryCta' => ['label' => 'Browse components', 'href' => '/components/button'],
		'secondaryCta' => ['label' => 'View examples', 'href' => '/components/button'],
		'shortcuts' => [
			['label' => 'Button', 'href' => '/components/button'],
			['label' => 'Card', 'href' => '/components/card'],
			['label' => 'Modal', 'href' => '/components/modal'],
			['label' => 'Icons', 'href' => '/icons'],
		],
	])
@endsection

@section('doc-content')
	@typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
		Components
	@endtypography
	@typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--3']])
		Browse all available components.
	@endtypography

	@if (!empty($componentOverviewItems ?? []))
		<div class="o-grid">
			@foreach (($componentOverviewItems ?? []) as $componentOverviewItem)
				<div class="o-grid-12@xs o-grid-6@sm o-grid-4@md">
					@box([
						'heading' => $componentOverviewItem['name'] ?? '',
						'content' => $componentOverviewItem['description'] ?? '',
						'link' => $componentOverviewItem['href'] ?? '#',
						'icon' => $componentOverviewItem['icon'] ?? 'widgets',
					])
					@endbox
				</div>
			@endforeach
		</div>
	@else
		@notice([
			'type' => 'warning',
			'message' => ['text' => 'No components are available right now.']
		])
		@endnotice
	@endif
@stop