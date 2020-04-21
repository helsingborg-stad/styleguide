@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #SplitButton    
    @endmarkdown


    @doc(['slug' => 'splitbutton', 'displayParams' => true])
        @splitbutton([
            'items' => [ ['text' => 'meh', 'link' => '#'], ['text' => 'story'], ['text' => 'bro']],
            'buttonText' => 'Choose an item!',
            'icon' => 'expand_more',
            'dropdownDirection' => 'top'
        ])
        @endsplitbutton

        @splitbutton([
            'items' => [ ['text' => 'cool'], ['text' => 'story'], ['text' => 'bro']],
            'buttonText' => 'Choose an item!',
            'icon' => 'expand_more',
            'dropdownDirection' => 'bottom'
        ])
        @endsplitbutton
    @enddoc

@stop



        
