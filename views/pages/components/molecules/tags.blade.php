@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Tags

        List of tags constructed to be shown below articles.
    @endmarkdown

    @doc(['slug' => 'tags'])
        @tags([
            'compress' => 5,
            'tags' => [
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
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ],
                [
                    'href' => '#',
                    'label' => 'sometag'
                ]
            ]
        ])
    @endtags


    @tags([
            'classList' => ['u-margin__top--4'],
            'compress' => 5,
            'tags' => [
                [
                    'label' => 'footag',
                    'color' => 'primary'
                ],
                [
                    'href' => '#',
                    'label' => 'bartag',
                    'color' => 'secondary'
                ]
            ]
        ])
    @endtags
@enddoc
@stop
