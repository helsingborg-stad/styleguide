@extends('layout.master')

@section('content')
    @markdown
        #Button
        A simple button, for button'ish purposes.         
    @endmarkdown

    @doc(['slug' => 'button'])

        @button([
            'href' => 'http://helsingborg.se/?variant=1', 
            'label' => "Button one", 
            'isOutlined' => true, 
            'isPrimary' => false
        ])
        @endbutton

        @button([
            'href' => 'http://helsingborg.se/?variant=2', 
            'label' => "Button two", 
            'isOutlined' => true, 
            'isPrimary' => true
        ])
        @endbutton

        @button([
            'href' => 'http://helsingborg.se/?variant=3', 
            'label' => "Button three", 
            'isOutlined' => false, 
            'isPrimary' => true
        ])
        @endbutton

    @enddoc
@stop



        