@extends('layout.master')

@section('content')
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
                    'size' => 'md',
                    
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
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
                    'icon' => ['size' => 'md', 'color' => 'black', 'name' => 'arrow-drop-down'],
                    'size' => 'md',
                    
                ])
                @endbutton
            @enddropdown
            
        </div>

    </div>
    

    @enddoc
   
@stop
