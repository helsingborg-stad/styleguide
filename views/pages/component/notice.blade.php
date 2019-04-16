@extends('layout.master')

@section('content')
    @markdown
        #Notices
        Get the users attention!
    @endmarkdown

    @doc(['slug' => 'notice'])

        @notice(['isWarning' => true])
            This is the content of this masterpiece called notice.
        @endnotice

        @notice(['isSuccess' => true])
            This is the content of this masterpiece called notice.
        @endnotice

        @notice(['isDanger' => true])
            This is the content of this masterpiece called notice.
        @endnotice

        @notice(['isInfo' => true])
            This is the content of this masterpiece called notice.
        @endnotice

    @enddoc
@stop



        