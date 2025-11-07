@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Layout Grid
  @endmarkdown
    @objects_doc(['viewDoc' => ['type' => 'objects', 'root' => 'layout-grid', 'config' => 'Layout-grid']])
    @endobjects_doc
</article>
@stop
