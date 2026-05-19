@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Blockquote
    The blockquote object is used to display a quote from another source. It can be used with the `blockquote` element and can include a citation using the `cite` attribute.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'blockquote', 'config' => 'Blockquote']])
    @enddoc
</article>
@stop
