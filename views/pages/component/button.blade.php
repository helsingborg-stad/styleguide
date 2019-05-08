@extends('layout.master')

@section('content')
    @markdown
        #Button
        A simple button, for button'ish purposes.         
    @endmarkdown

    @doc(['slug' => 'button'])

        @button([
            'href' => 'http://helsingborg.se/?variant=1', 
            'isOutlined' => true, 
            'isPrimary' => false
        ])
            Button one
        @endbutton

        @button([
            'href' => 'http://helsingborg.se/?variant=2', 
            'isOutlined' => true, 
            'isPrimary' => true
        ])
            Button two
        @endbutton

        @button([
            'href' => 'http://helsingborg.se/?variant=3', 
            'isOutlined' => false, 
            'isPrimary' => true
        ])
        Button three
        @endbutton

        @button([
        'href' => 'http://helsingborg.se/?variant=3',
        'isOutlined' => false,
        'isPrimary' => false,
        'isContrasted' => true
        ])
        Button three
        @endbutton

    @enddoc
@stop



        