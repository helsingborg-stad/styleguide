@extends('layout.master')

@section('content')
<article>

    @markdown
        #Disabled
    @endmarkdown
    @utility_doc(['slug'=> 'disabled','page_config' => "true"])
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
