@extends('layout.containers.doc')

@section('doc-content')
    @typography(['element' => 'h1', 'variant' => 'h1'])
        {{ $headline ?? 'Component' }}
    @endtypography

    @if(isset($description) && !empty($description))
        @typography(['element' => 'p', 'variant' => 'body'])
            {{ $description }}
        @endtypography
    @endif

    @if(isset($similarComponentItems) && is_array($similarComponentItems) && !empty($similarComponentItems))
        @typography(['element' => 'h2', 'variant' => 'h3'])
            Similar components
        @endtypography

        <ul class="unlist">
            @foreach($similarComponentItems as $similarComponentItem)
                <li class="u-margin__bottom--1">
                    @link([
                        'href' => $similarComponentItem['href'],
                        'text' => $similarComponentItem['name'],
                    ])
                    @endlink
                </li>
            @endforeach
        </ul>
    @endif

    @if(isset($slug) && !empty($slug))
        @doc(['slug' => $slug])
        @enddoc
    @endif
@stop
