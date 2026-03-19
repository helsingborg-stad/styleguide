@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Grid
        Grid is an object that allows you to create a grid of elements. Please note that we support both the .grid and .o-grid syntax. However the .grid class should be considered deprecated and .o-grid  as it's better scoped and is therefor favored.
    @endmarkdown

    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'grid', 'config' => 'Grid']])
    @enddoc
@stop
