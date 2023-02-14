@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Site selector
		A component that will display available sites in a network, or represent a variarity of customer types (business, private). 
    @endmarkdown

    @doc(['slug' => 'siteselector'])
    @enddoc
@stop
