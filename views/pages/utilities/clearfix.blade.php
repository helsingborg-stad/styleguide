@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Clearfix
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'clearfix', 'config' => 'clearfix']])
        <div style="background-color: brown" class="u-clearfix">
            @button([
                'href' => '#btn-3', 
                'isOutlined' => false, 
                'isPrimary' => true,
                'classList' => ['u-float--left']
            ])
            Float Left
            @endbutton

            @button([
                'href' => '#btn-3',
                'isOutlined' => false,
                'isPrimary' => false,
                'isCircle' => true,
                'classList' => ['u-float--right']
            ])
            Float Right
            @endbutton
        </div>
    @endutility_doc

</article>
@stop
