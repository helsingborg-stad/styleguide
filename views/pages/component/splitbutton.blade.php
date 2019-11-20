@extends('layout.master')

@section('content')
    @markdown
        #SplitButton    
    @endmarkdown


    @doc(['slug' => 'splitbutton', 'displayParams' => true])
        @splitbutton([
           'items' => [ ['text' => 'meh', 'link' => '#'], ['text' => 'story'], ['text' => 'bro']],
           'backgroundColor' => 'secondary',
           'buttonText' => 'Choose an item!',
           'icon' => ['name' => 'arrow-drop-up', 'size' => 'md', 'color' => 'black'],
           'dropdownDirection' => 'top'
        ])
        @endsplitbutton

        @splitbutton([
           'items' => [ ['text' => 'cool'], ['text' => 'story'], ['text' => 'bro']],
           'backgroundColor' => 'default',
           'borderColor' => 'default',
           'buttonText' => 'Choose an item!',
           'icon' => ['name' => 'arrow-drop-down', 'size' => 'md', 'color' => 'black'],
           'dropdownDirection' => 'bottom'
        ])
        @endsplitbutton
    @enddoc

@stop



        
