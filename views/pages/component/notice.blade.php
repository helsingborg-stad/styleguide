@extends('layout.master')

@section('content')
    @markdown
        #Notices
        Get the users attention!
    @endmarkdown

    @doc(['slug' => 'notice'])

        @notice(['isWarning' => true, 'message' => 'test', 'slide' => 'right'])
        @endnotice

        @notice([
            'isSuccess' => true,
            'slide' => 'top',
            'singleUse' => true, 
            'message' => [
                'text' => 'yo',
                'size' => 'md'
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endnotice

        @notice([
            'isDanger' => true,
            'slide' => 'right',
            'message' => [
                'text' => 'yo',
                'size' => 'md'
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endnotice

        @notice([
            'isInfo' => true,
            'slide' => 'left',
            'message' => [
                'text' => 'yo',
                'size' => 'md'
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endnotice

        @notice([
            'isWarning' => true,
            'slide' => 'bottom',
            'message' => [
                'text' => 'yo',
                'size' => 'md'
            ],
            'icon' => [
                'name' => 'check',
                'size' => 'md',
                'color' => 'black'
            ]
        ])
        @endnotice

    @enddoc
@stop



        