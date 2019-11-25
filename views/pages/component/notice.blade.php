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
                'text' => 'Tellus Sem Lorem Malesuada Ipsum',
                'size' => 'sm'
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
                'text' => 'Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                'size' => 'sm'
            ],
            'icon' => [
                'name' => 'report',
                'size' => 'md',
                'color' => 'white'
            ]
        ])
        @endnotice

        @notice([
            'isInfo' => true,
            'message' => [
                'text' => 'Sed posuere consectetur est at lobortis.',
                'size' => 'sm'
            ],
            'icon' => [
                'name' => 'forum',
                'size' => 'md',
                'color' => 'black'
            ]
        ])
        @endnotice

        @notice([
            'isWarning' => true,
            'message' => [
                'text' => 'Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis.',
                'size' => 'sm'
            ],
            'icon' => [
                'name' => 'greeting',
                'size' => 'md',
                'color' => 'black'
            ]
        ])
        @endnotice

    @enddoc
@stop



        