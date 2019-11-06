@extends('layout.master')

@section('content')
    @markdown
        #Button      
    @endmarkdown

    @doc(['slug' => 'buttonGroup'])

        @buttonGroup(['borderColor' => 'primary', 'backgroundColor' => 'primary'])

            @button([
                'color' => 'secondary',
                'text' => 'One',
                'size' => 'md',
                'isOutlined' => true
            ])
            @endbutton

            @button([
                'color' => 'primary',
                'text' => 'Two',
                'size' => 'md',
                'isOutlined' => true,      
                'background' => 'primary'      
            ])
            @endbutton

            @button([
                'color' => 'primary',    
                'isOutlined' => false,
                'isIconButton' => true,
                'icon' => ['name' => 'close', 'color' => 'white', 'size' => 'md'],
                'background' => 'primary'
            ])

            @endbutton

            @button([
                'color' => 'primary',
                'text' => 'Three',
                'background' => 'primary',
                'isOutlined' => false,
                'icon' => ['name' => 'close'],
                'size' => 'md',
                'reverseIcon' => true
            ])
            @endbutton

        @endbuttonGroup
        

    @enddoc
@stop



        