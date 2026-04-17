@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Tooltip
    The tooltip object displays a small text bubble for any element using the `data-tooltip` attribute.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'tooltip', 'config' => 'Tooltip']])
    @enddoc
</article>
@stop
