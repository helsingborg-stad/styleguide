@extends('layout.master')

@section('content')
  
   
    @doc(['slug' => 'dropdown'])
    @markdown
        #Dropdown      
    @endmarkdown
    @dropdown([
        'items' => ['cool', 'story', 'bro'],
        'direction' => 'bottom',
        'popup' => 'focus'
    ])

    @enddropdown

    @enddoc
   
@stop
