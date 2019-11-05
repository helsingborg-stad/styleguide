@extends('layout.master')

@section('content')
    @markdown
        #Button      
    @endmarkdown

    @doc(['slug' => 'button'])

        @button([   
            'color' => 'secondary'
        ])
        @endbutton

        @button([
            'href' => '#btn-3', 
            'isOutlined' => false, 
            'background' => 'primary',
            'text' => 'Button',
            'icon' => ['name' => 'close', 'color' => 'black'],
            'size' => 'md',
            'reverseIcon' => true,
            'floating' => ['animate' => true, 'hover' => true]
        ])
        @endbutton

        @button([
            'href' => '#btn-3', 
            'isOutlined' => false, 
            'background' => 'primary',
            'text' => 'Button',
            'icon' => ['name' => 'close', 'color' => 'black'],
            'size' => 'lg',
            'reverseIcon' => false,
            'floating' => true
        ])
        @endbutton

        

    @enddoc

    @doc(['slug' => 'button'])
        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'secondary', 'size' => 'sm'],
            'floating' => ['animate' => false, 'hover' => false],
            'background' => false
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'primary', 'size' => 'md'],
            'floating' => ['animate' => false, 'hover' => false],
            'background' => false
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'lg'],
            'background' => false
        ])
        @endbutton
    @enddoc
@stop



        