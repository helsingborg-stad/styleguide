@extends('layout.master')

@section('content')
    @markdown
        #Components
        The component library is a collection of robust views with builtin logic to handle common scenarios. 

        ##Why use components? 
        The basic purpose of the component library is that they allows third party developer to manipulate data before it enters the view. 

        This simple concept makes it a powerful tool to manipulate display of content without to touch a single line of html. And hey, if thay want to they can replace both controllers and views to make deep customizations.
    @endmarkdown
@stop
