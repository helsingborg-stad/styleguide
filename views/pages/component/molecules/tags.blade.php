@extends('layout.master')

@section('content')
    @markdown
        # Tags

        List of tags constructed to be shown below articles.
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
