@extends('layout.master')

@section('content')
  
   
    @doc(['slug' => 'dropdown'])
    @markdown
        #Dropdown      
    @endmarkdown
        @dropdown([])

        @enddropdown

    @enddoc
   
@stop
