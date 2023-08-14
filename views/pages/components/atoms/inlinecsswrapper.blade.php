@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Inline Css Wrapper      
    @endmarkdown


    @doc(['slug' => 'inlinecsswrapper'])
    @enddoc
@stop