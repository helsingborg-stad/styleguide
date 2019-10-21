@extends('layout.master')

@section('content')
<article>

    @markdown
        #Responsive Media
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'responsive-media', 'config' => 'responsive-media']])
        <img src="https://picsum.photos/300/200?image=1026" class="u-media--responsive"/>
    @endutility_doc

</article>
@stop
