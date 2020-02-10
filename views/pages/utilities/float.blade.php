@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Float
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'float', 'config' => 'float']])
        <div>
            @button([
                    'href' => '#btn-1', 
                    'isOutlined' => true, 
                    'isPrimary' => false,
                    'classList' => ['u-float--left']
                ])
                    Float left
                @endbutton

                @button([
                    'href' => '#btn-2', 
                    'isOutlined' => true, 
                    'isPrimary' => true,
                    'classList' => ['u-float--left']
                ])
                    Float left
                @endbutton

                @button([
                    'href' => '#btn-3', 
                    'isOutlined' => false, 
                    'isPrimary' => true,
                    'classList' => ['u-float--right']
                ])
                Float right
                @endbutton

                @button([
                    'href' => '#btn-3',
                    'isOutlined' => false,
                    'isPrimary' => false,
                    'isCircle' => true,
                    'classList' => ['u-float--right']
                ])
                Float right
            @endbutton
        </div>
    @endutility_doc


    

</article>
@stop
