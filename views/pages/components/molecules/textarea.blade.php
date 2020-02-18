@extends('layout.containers.doc')

@section('doc-content')
<div>
    @markdown
    ##Textarea
    @endmarkdown

    @doc(['slug' => 'textarea'])
    @enddoc

</div>
@endsection