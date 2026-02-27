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
		'secondaryCta' => ['label' => 'View examples', 'href' => '/components/usage/button'],
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
		Main overview page for components.
	@endtypography
@stop