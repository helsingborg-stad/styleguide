@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Tags

        List of tags constructed to be shown below articles.
    @endmarkdown

    @doc(['slug' => 'tags'])
        @tags(['tags' => [
            [
                'label' => 'footag',
                'color' => 'primary'
            ],
            [
                'href' => '#',
                'label' => 'bartag',
                'color' => 'secondary'
            ],
            [
                'href' => '#',
                'label' => 'sometag'
            ]
        ]])
    @endtags
@enddoc
@stop
