@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #SplitButton    
    @endmarkdown


    @doc(['slug' => 'splitbutton', 'displayParams' => true])
        @splitbutton([
           'items' => [ ['text' => 'meh', 'link' => '#'], ['text' => 'story'], ['text' => 'bro']],
           'backgroundColor' => 'secondary',
           'buttonText' => 'Choose an item!',
           'icon' => ['name' => 'keyboard_arrow_up', 'size' => 'md', 'color' => 'black'],
           'dropdownDirection' => 'top'
        ])
        @endsplitbutton

        @splitbutton([
           'items' => [ ['text' => 'cool'], ['text' => 'story'], ['text' => 'bro']],
           'backgroundColor' => 'default',
           'borderColor' => 'default',
           'buttonText' => 'Choose an item!',
           'icon' => ['name' => 'keyboard_arrow_up', 'size' => 'md', 'color' => 'black'],
           'dropdownDirection' => 'bottom'
        ])
        @endsplitbutton
    @enddoc

@stop



        
