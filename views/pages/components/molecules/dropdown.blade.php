@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Dropdown      
    @endmarkdown
   
    @doc(['slug' => 'dropdown'])
    

    <div class="grid">
        <div class="grid-s-12 grid-md-6">
                @markdown
                    ##Dropdown on click      
                @endmarkdown
            @dropdown([
            'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
            'direction' => 'left',
            'popup' => 'click'
            ])
                @button([
                    'text' => 'Left',
                    'icon' => 'keyboard_arrow_left',
                    'size' => 'md',
                    'reversePositions' => true
                    
                ])
                @endbutton
            @enddropdown
            <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'right',
                'popup' => 'click'
            ])
                @button([
                    'text' => 'Right',
                    'icon' => 'keyboard_arrow_right',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'top',
                'popup' => 'click'
            ])
                @button([
                    'text' => 'Top',
                    'icon' => 'keyboard_arrow_up',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'bottom',
                'popup' => 'click'
            ])
                @button([
                    'text' => 'Bottom',
                    'icon' => 'keyboard_arrow_down',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown

        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ##Dropdown on hover      
            @endmarkdown
            @dropdown([
            'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
            'direction' => 'left',
            'popup' => 'hover'
            ])
                @button([
                    'text' => 'Left',
                    'icon' => 'keyboard_arrow_left',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
                <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'right',
                'popup' => 'hover'
            ])
                @button([
                    'text' => 'Right',
                    'icon' => 'keyboard_arrow_right',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'top',
                'popup' => 'hover'
            ])
                @button([
                    'text' => 'Top',
                    'icon' => 'keyboard_arrow_up',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            <br>
            @dropdown([
                'items' => [ ['text' => 'cool', 'link' => '#'], ['text' => 'story', 'link' => '#'], ['text' => 'bro', 'link' => '#']],
                'direction' => 'bottom',
                'popup' => 'hover'
            ])
                @button([
                    'text' => 'Bottom',
                    'icon' => 'keyboard_arrow_down',
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            
        </div>

    </div>
    

    @enddoc
   
@stop
