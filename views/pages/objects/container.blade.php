@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Container
        The container object controls horizontal rhythm and readable content width.
    @endmarkdown

    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'container', 'config' => 'Container']])
    @enddoc
@stop
