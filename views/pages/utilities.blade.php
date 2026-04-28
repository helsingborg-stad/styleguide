@extends('layout.containers.doc')

@section('doc-hero')
	@include('layout.partials.doc-hero', [
		'title' => 'Utilities',
		'subtitle' => 'Browse utility classes and usage patterns.',
		'metaTags' => [
			['label' => 'Single-purpose CSS helpers'],
			['label' => 'Utility API references']
		],
		'primaryCta' => ['label' => 'Browse utilities', 'href' => '/utilities/spacing'],
		'secondaryCta' => ['label' => 'View flex utilities', 'href' => '/utilities/flex'],
		'shortcuts' => [
			['label' => 'Spacing', 'href' => '/utilities/spacing'],
			['label' => 'Display', 'href' => '/utilities/display'],
			['label' => 'Colors', 'href' => '/utilities/colors'],
			['label' => 'Position', 'href' => '/utilities/position'],
		],
	])
@endsection

@section('doc-content')
	@typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
		Utilities
	@endtypography

	@if (!empty($utilitiesOverviewItems ?? []))
		<div class="o-grid">
			@foreach (($utilitiesOverviewItems ?? []) as $utilityOverviewItem)
				<div class="o-grid-12@xs o-grid-6@sm o-grid-4@md">
					@box([
						'heading' => $utilityOverviewItem['name'] ?? '',
						'content' => $utilityOverviewItem['description'] ?? '',
						'link' => $utilityOverviewItem['href'] ?? '#',
						'icon' => $utilityOverviewItem['icon'] ?? 'tune',
					])
					@endbox
				</div>
			@endforeach
		</div>
	@else
		@notice([
			'type' => 'warning',
			'message' => ['text' => 'No utilities are available right now.']
		])
		@endnotice
	@endif
@stop
