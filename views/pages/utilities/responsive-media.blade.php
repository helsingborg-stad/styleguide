@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Responsive Media
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'responsive-media', 'config' => 'responsive-media']])
        <img src="https://picsum.photos/id/1026/300/200" class="u-media--responsive"/>
    @endutility_doc

</article>
@stop
