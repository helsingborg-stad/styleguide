@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    #Box

    Boxes are surfaces that display content and actions on a single topic, with a solid background color. They may be provided with an icon/svg image. 
    @endmarkdown


    @doc(['slug' => 'box'])
    @enddoc
@stop
