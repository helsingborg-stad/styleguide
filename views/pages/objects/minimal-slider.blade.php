@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Minimal Slider
    A lightweight, scroll-snap based slider demo with keyboard navigation, touch support, and accessible announcements.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'minimal-slider', 'config' => 'Minimal-slider']])
    @enddoc
</article>
@stop
