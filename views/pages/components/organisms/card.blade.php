@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    #Cards

    Cards are surfaces that display content and actions on a single topic. <br />

    They should be easy to scan for relevant and actionable information. Elements, like text and images, <br />
    should be placed on them in a way that clearly indicates hierarchy.
    @endmarkdown


    @doc(['slug' => 'card'])
    @enddoc
@stop




