@extends('layout.containers.doc')

@section('doc-content')
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