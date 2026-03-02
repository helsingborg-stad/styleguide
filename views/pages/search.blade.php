@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--1']])
        Search results
    @endtypography

    @if (($searchTotal ?? 0) > 0)
        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
            Found {{ $searchTotal }} matching component(s) on "{{ $searchQuery ?? '' }}".
        @endtypography

        <div class="o-grid o-grid--large">
            @foreach(($componentSearchResults ?? []) as $result)
                <div class="o-grid-12 o-grid-6@md">
                    @card([
                        'heading' => $result['name'] ?? '',
                        'content' => $result['description'] ?? '',
                        'link' => $result['url'] ?? '#',
                        'classList' => ['u-height--100']
                    ])
                    @endcard
                </div>
            @endforeach
        </div>
    @else
        @notice([
            'type' => 'warning',
            'message' => ['text' => 'No results found for your search. Please try a different search term.']
        ])
        @endnotice
    @endif
@stop
