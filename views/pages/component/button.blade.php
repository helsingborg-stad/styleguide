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
            'icon' => ['name' => 'close', 'color' => 'black'],
            'size' => 'sm',
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
            'color' => 'secondary',
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
            'color' => 'secondary',
            'reverseIcon' => false,
            'floating' => false
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'secondary', 'size' => 'sm'],
            'floating' => ['animate' => false, 'hover' => false]
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'primary', 'size' => 'md'],
            'floating' => ['animate' => false, 'hover' => false]
        ])
        @endbutton

        @button([
            'href' => '#btn-3',
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'lg']
      
        ])
        @endbutton

    @enddoc
@stop



        