@extends('layout.master')

@section('content')
    @markdown
        #Floating Action Button     
    @endmarkdown

    @doc(['slug' => 'fab'])

        @fab([
            'position' => 'bottom-left',
            'spacing' => 'md',
            'button' => [
                'href' => '#btn-3',
                'background' => 'primary',
                'isIconButton' => true,
                'icon' => ['name' => 'close', 'color' => 'white', 'size' => 'lg'],
                'reverseIcon' => true,
                'size' => 'lg',
                'color' => 'secondary',
                'floating' => [
                    'animate' => false,
                    'hover' => true
                ],
            ]
        ])
        @endfab

        @fab([
            'position' => 'bottom-right',
            'spacing' => 'xl',
            'button' => [
                'href' => '#btn-3',
                'text' => 'Extended',
                'background' => 'primary',
                'icon' => ['name' => 'close'],
                'reverseIcon' => true,
                'size' => 'lg',
                'color' => 'secondary',
                'floating' => [
                    'animate' => false,
                    'hover' => true
                ],
            ]
        ])
        @endfab
    @enddoc
@stop



        