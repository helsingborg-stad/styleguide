@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Brand
        Displays a logotype according to the logotype component. Adds the ability to show text besides the logotype.
    @endmarkdown

    @doc(['slug' => 'brand'])
    @enddoc
@stop
