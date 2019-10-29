@extends('layout.master')

@section('content')
    @markdown
        #Notices
        Get the users attention!
    @endmarkdown

    @doc(['slug' => 'notice'])

        @notice(['isWarning' => true, 'message' => 'test', 'slide' => 'right'])
        @endnotice

        @notice(['isSuccess' => true, 'slide' => 'left', 'message' => 'yo', 'icon' => 'check'])
        @endnotice

        @notice(['isDanger' => true, 'message' => 'lol', 'slide' => 'top', ])
        @endnotice

        @notice(['isInfo' => true, 'slide' => 'bottom', 'message' => 'nope'])
        @endnotice

    @enddoc
@stop



        