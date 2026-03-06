@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Layout Grid
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'layout-grid', 'config' => 'Layout-grid']])
    @enddoc
</article>
@stop
