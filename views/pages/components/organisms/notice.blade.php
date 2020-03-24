@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Notices
        Get the users attention!
    @endmarkdown

    @doc(['slug' => 'notice'])
    @enddoc
@stop



        