@extends('layout.master')

@section('content')
    @markdown
        #Button      
    @endmarkdown

    @doc(['slug' => 'buttonGroup'])

        @buttonGroup(['borderColor' => 'primary', 'backgroundColor' => 'primary', 'toggle' => true])

            @button([
                'color' => 'secondary',
                'text' => 'Togge #1',
                'size' => 'md',
                'isOutlined' => true,
                'attributeList' => ['js-toggle-trigger' => '']
            ])
            @endbutton

            @button([
                'color' => 'primary',
                'text' => 'Toggle #2',
                'size' => 'md',
                'isOutlined' => true,      
                'background' => 'primary',
                'attributeList' => ['js-toggle-trigger' => '']   
            ])
            @endbutton

            @button([
                'color' => 'primary',    
                'isOutlined' => false,
                'isIconButton' => true,
                'icon' => ['name' => 'close', 'color' => 'white', 'size' => 'md'],
                'background' => 'secondary',
                'attributeList' => ['js-toggle-trigger' => '']
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



        