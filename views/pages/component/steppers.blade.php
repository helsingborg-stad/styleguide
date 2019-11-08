@extends('layout.master')

@section('content')
    @markdown
    #Steppers
    @endmarkdown

    @doc(['slug' => 'steppers'])

        @steppers(
        [
            'type' => 'dots'
        ])
        @endsteppers


    @enddoc
@stop