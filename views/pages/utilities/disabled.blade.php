@extends('layout.master')

@section('content')
<article>

    @markdown
        #Disabled
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'disabled', 'config' => 'disabled']])
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
