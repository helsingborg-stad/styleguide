@extends('layout.containers.doc')

@section('doc-content')
<article>

    
    @markdown
        ###Box shadow
    @endmarkdown
    
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'shadows', 'config' => 'box-shadow']])
        <div class="d-shadows">
            <div class='u-box-shadow--1 u-padding--2 u-rounded' >Level 1</div>
            <div class='u-box-shadow--2 u-padding--2 u-rounded' >Level 2</div>
            <div class='u-box-shadow--3 u-padding--2 u-rounded' >Level 3</div>
            <div class='u-box-shadow--4 u-padding--2 u-rounded' >Level 4</div>
            <div class='u-box-shadow--5 u-padding--2 u-rounded' >Level 5</div>
        </div>
        
    @endutility_doc 

</article>
@stop
