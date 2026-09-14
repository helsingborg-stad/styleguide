@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Popover
    The popover object documents the native HTML element and attribute based API for popovers.
    The examples below use normal elements and attributes such as `popovertarget`, `popovertargetaction`, `popover`, and the styleguide placement attributes.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'popover', 'config' => 'Popover']])
    @enddoc
</article>
@stop
