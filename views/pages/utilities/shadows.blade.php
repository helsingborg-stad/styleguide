@extends('layout.containers.doc')

@section('doc-content')
<article>

    
    @markdown
        ###Box shadow
    @endmarkdown
    
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'shadows', 'config' => 'box-shadow']])
        <div class='u-box-shadow--1 u-m--bottom--2 u-p--2' >This is a div with box shadow level 1</div>
        <div class='u-box-shadow--2 u-m--bottom--2 u-p--2' >This is a div with box shadow level 2</div>
        <div class='u-box-shadow--3 u-m--bottom--2 u-p--2' >This is a div with box shadow level 3</div>
        <div class='u-box-shadow--4 u-m--bottom--2 u-p--2' >This is a div with box shadow level 4</div>
        <div class='u-box-shadow--5 u-p--2' >This is a div with box shadow level 5</div>
    @endutility_doc 

</article>
@stop
