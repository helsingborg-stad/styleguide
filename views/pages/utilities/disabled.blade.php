@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Disabled
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'disabled', 'config' => 'disabled']])
        @typography([])
           Applying the disabled class to an element gives it the disabled look but not actually disabling the element.
        @endtypography

        @button([
            'href' => '#btn-1', 
            'isOutlined' => true, 
            'isPrimary' => false,
            'classList' => ['u-disabled']
        ])
            Disabled Button
        @endbutton
    @endutility_doc

</article>
@stop
