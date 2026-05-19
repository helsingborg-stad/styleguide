@extends('layout.containers.doc')

@section('doc-hero')
	@include('layout.partials.doc-hero', [
		'title' => 'HTML elements',
		'subtitle' => 'Documented semantic HTML patterns with live examples and usage guidance.',
		'metaTags' => [
			['label' => 'Semantic markup'],
			['label' => 'Examples and attribute docs']
		],
		'primaryCta' => ['label' => 'Browse elements', 'href' => '/elements/blockquote'],
		'secondaryCta' => ['label' => 'View blockquote', 'href' => '/elements/blockquote'],
		'shortcuts' => [
			['label' => 'Blockquote', 'href' => '/elements/blockquote'],
		],
	])
@endsection

@section('doc-content')
	@typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
		Elements
	@endtypography

	@if (!empty($elementsOverviewItems ?? []))
		<div class="o-grid">
			@foreach (($elementsOverviewItems ?? []) as $elementOverviewItem)
				<div class="o-grid-12@xs o-grid-6@sm o-grid-4@md">
					@box([
						'heading' => $elementOverviewItem['name'] ?? '',
						'content' => $elementOverviewItem['description'] ?? '',
						'link' => $elementOverviewItem['href'] ?? '#',
						'icon' => $elementOverviewItem['icon'] ?? 'code_blocks',
					])
					@endbox
				</div>
			@endforeach
		</div>
	@else
		@notice([
			'type' => 'warning',
			'message' => ['text' => 'No elements are available right now.']
		])
		@endnotice
	@endif
@stop
