@extends('layout.master')

@section('content')
    @markdown
        #Button
        A simple button, for button'ish purposes.         
    @endmarkdown

    @doc(['slug' => 'button'])

        @button([
            'href' => '#btn-1', 
            'isOutlined' => true, 
            'isPrimary' => false
        ])
            Button one
        @endbutton

        @button([
            'href' => '#btn-2', 
            'isOutlined' => true, 
            'isPrimary' => true
        ])
            Button two
        @endbutton

        @button([
            'href' => '#btn-3', 
            'isOutlined' => false, 
            'isPrimary' => true
        ])
        Button three
        @endbutton

        @button([
            'href' => '#btn-3',
            'isOutlined' => false,
            'isPrimary' => false,
            'isCircle' => true
        ])
        Button four
        @endbutton

    @enddoc
@stop



        