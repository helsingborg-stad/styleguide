@extends('layout.master')

@section('content')
    @markdown
        # Tags
    @endmarkdown

    @doc(['slug' => 'tags'])
        @tags(['tags' => array(
            array(
                'href' => '#',
                'label' => 'footag'
            ),
            array(
                'href' => '#',
                'label' => 'bartag'
            ),
            array(
                'href' => '#',
                'label' => 'sometag'
            )
        )])
    @endtags
@enddoc
@stop
