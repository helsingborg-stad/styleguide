@extends('layout.master')

@section('content')
    @markdown
        #Alert
        Replaces the buil-in javascript alert('') and confirm('') functions form Javascript with a fancier one.
    @endmarkdown

    @doc(['slug' => 'alert'])

        @alert(['title'=>"Wait a minute!", 'accept' => 'Yes, dont sent me any more.', 'dismiss' => 'Oh no, sorry!'])
            Are you shure that you want to stop getting our newletter, free goddies and awesome tips? 
        @endalert

    @enddoc
@stop
