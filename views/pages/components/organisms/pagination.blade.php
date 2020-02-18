@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Pagination

        <b>Important notice:</b> The pagination component will not remove pages from the index if it overflows. Please trtuncate your array before sending it into list parameter. 

    @endmarkdown

    @doc(['slug' => 'pagination'])
    @enddoc
@stop



