@extends('layout.master')

@section('content')
    @markdown
        #Button      
    @endmarkdown

    @doc(['slug' => 'button'])

        @button([
            'href' => '#btn-3', 
            'isOutlined' => true, 
            'text' => 'Button',
            'icon' => 'apps',
            'size' => 'lg',
            'color' => 'secondary'
        ])
        @endbutton

        @button([
            'href' => '#btn-3', 
            'isOutlined' => false, 
            'background' => 'primary',
            'text' => 'Button',
            'icon' => 'apps',
            'size' => 'lg',
            'color' => 'secondary',
            'reverseIcon' => true,
            'floating' => true
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isOutlined' => false,
            'isIconButton' =>  true,
            'icon' => 'close',
            'reverseIcon' => false,
            'size' => 'lg',
            'color' => 'secondary',
            'floating' => ['animate' => true, 'hover' => true]
        ])
        @endbutton

    @enddoc
@stop



        