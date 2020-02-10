@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Visibility
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'visibility', 'config' => 'visibility']])
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
