@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Acceptance
		A component that can wrap any other content to prevent it from being rendered on page load. 
		
		Wrapped content will instead be printed inside a ```<template>``` tag and a message will be shown to the user that lets them know that there are blocked content that they need to accept to by clicking a button included with the message.

		#
    @endmarkdown

    @doc(['slug' => 'acceptance'])
    @enddoc
@stop
