@extends('layout.master')

@section('content')
<article>

    @markdown
        #Visibility
    @endmarkdown
    @utility_doc(['slug' => 'visibility', 'page_config' => 'true'])
        @button([
            'href' => '#btn-3',
            'isOutlined' => false,
            'isPrimary' => false,
            'isCircle' => true,
            'classList' => ['u-visibility--visible']
        ])
            Visible button
        @endbutton

        @button([
            'href' => '#btn-3',
            'isOutlined' => false,
            'isPrimary' => false,
            'isCircle' => true,
            'classList' => ['u-visibility--hidden']
        ])
            Hidden Button
        @endbutton
    @endutility_doc

</article>
@stop
