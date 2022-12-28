@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Z-index
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'z-index', 'config' => 'z-index']])
    <div class="u-level-1" style="width:200px;height:200px;background-color:chocolate;position:absolute;top:4rem;left:30px;">1</div>
    <div class="u-level-3" style="width: 200px;height:200px;background-color:aquamarine;position:absolute;top:4rem;left:180px;">3</div>
    <div class="u-level-2" style="width: 200px;height:200px;background-color:hotpink;position:absolute;top:8rem;left:90px">2</div>
    <div style="width: 200px;height:400px;background:transparent;"></div>
    
    @endutility_doc

</article>
@stop
