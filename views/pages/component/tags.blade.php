@extends('layout.master')

@section('content')
    @markdown
        # Tags
    @endmarkdown

    @doc(['slug' => 'tags'])
    @tags(['tags' => array(
        array(
            'href' => '#',
            'label' => 'Label one'
        ),
        array(
            'href' => '#',
            'label' => 'Label two'
        ),
        array(
            'href' => '#',
            'label' => 'Label three'
        )
    )])

    @endtags
@enddoc
@stop
