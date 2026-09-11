@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Popover
    The popover component is used to display additional information in a small overlay. It can be triggered by a click or hover event on a target element. The popover can contain text, images, or other HTML content, and it can be positioned in various ways relative to the target element.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'popover', 'config' => 'Popover']])
    @enddoc
</article>
@stop
