@extends('layout.master')

@section('content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'vertical-align', 'config' => 'vertical-align']])
        
            <span class="u-align--baseline">baseline</span>
            <span class="u-align--top">top</span>
            <span class="u-align--middle">middle</span>
            <span class="u-align--bottom">bottom</span>
            <span class="u-align--text-top">text-top</span>
            <span class="u-align--text-bottom">text-bottom</span>
     
    @endutility_doc


</article>
@stop
