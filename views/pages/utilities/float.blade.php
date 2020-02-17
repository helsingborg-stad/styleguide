@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Float
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'float', 'config' => 'float']])
        @typography([])
            The <code>u-float</code> class lets you float elements to the side or remove the float setting on an element. This class does not have any effect on flex items.
        @endtypography

        <div>
            @button([
                'href' => '#', 
                'isOutlined' => true, 
                'isPrimary' => false,
                'classList' => ['u-float--left']
            ])
                Float left
            @endbutton

            @button([
                'href' => '#',
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
