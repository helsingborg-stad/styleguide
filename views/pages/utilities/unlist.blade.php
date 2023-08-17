@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'unlist', 'config' => 'unlist']])
      <ul class="u-unlist">
        <li>A list</li>
        <li>using the class</li>
        <li>u-unlist</li>
      </ul>
    @endutility_doc
</article>
@stop
