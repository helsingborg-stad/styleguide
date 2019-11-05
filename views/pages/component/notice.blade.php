@extends('layout.master')

@section('content')
    @markdown
        #Notices
        Get the users attention!
    @endmarkdown

    @doc(['slug' => 'notice'])
        @notice([
            'isSuccess' => true,
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



        