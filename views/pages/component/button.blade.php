@extends('layout.master')

@section('content')
    @markdown
        #Button      
    @endmarkdown


    @doc(['slug' => 'button', 'displayParams' => false])
    <div class="grid">
        <div class="grid-s-12 grid-md-6">

            @markdown
                ###Button sizes ranging from sm to lg
            @endmarkdown

            @button([
                'color' => 'secondary',
                'size' => 'sm',
                'text' => 'Primary'
            ])
            @endbutton

            @button([
                'color' => 'secondary',
                'size' => 'md',
                'text' => 'Primary'
            ])
            @endbutton

            @button([
                'color' => 'secondary',
                'size' => 'lg',
                'text' => 'Primary'
            ])
            @endbutton

        </div>
        <div class="grid-s-12 grid-md-6">

            @markdown
                ###Button with icon and text, reversed and not
            @endmarkdown

            @button([
                'icon' => ['name' => 'close', 'color' => 'black'],
                'reverseIcon' => true,
                'text' => 'Reversed'
            ])
            @endbutton

            @button([
                'icon' => ['name' => 'close', 'color' => 'black'],
                'text' => 'Not reversed'
            ])
            @endbutton

        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Different backgrounds    
            @endmarkdown
    
            @button([
                'background' => 'primary',
                'text' => 'Primary bg'
            ])
            @endbutton
    
            @button([
                'background' => 'secondary',
                'text' => 'Secondary bg'
            ])
            @endbutton
    
            @button([
                'background' => 'default',
                'text' => 'Default bg'
            ])
            @endbutton
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Buttons with floating effect      
            @endmarkdown
    
            @button([
                'floating' => ['animate' => true, 'hover' => true],
                'text' => 'Animate + hover'
            ])
            @endbutton
    
            @button([
                'floating' => ['animate' => false, 'hover' => true],
                'text' => 'Only hover'
            ])
            @endbutton
    
            @button([
                'floating' => ['animate' => false, 'hover' => false],
                'text' => 'No hover or animate'
            ])
            @endbutton
    
            @markdown
                ###Button with toggle    
            @endmarkdown
    
            @button([
                'text' => 'Click to toggle!',
                'toggle' => true,
                'attributeList' => ['js-toggle-trigger' => '']
            ])
            @endbutton
        </div>
    </div>


    @enddoc

    @markdown
        ###Icon buttons      
    @endmarkdown

    @doc(['slug' => 'button'])
    <div class="grid">
        <div class="grid-s-12 grid-md-3">

            @markdown
                ####Floating icon buttons
            @endmarkdown
            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'floating' => ['animate' => true, 'hover' => true],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'floating' => ['animate' => false, 'hover' => true],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'background' => false,
                'floating' => ['animate' => false, 'hover' => false]
            ])
            @endbutton

        </div>
        <div class="grid-s-12 grid-md-3">

            @markdown
                ####Different colors
            @endmarkdown

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'primary', 'size' => 'md'],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'secondary', 'size' => 'md'],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'background' => false,
            ])
            @endbutton

        </div>
        <div class="grid-s-12 grid-md-4">

            @markdown
                ####Different sizes: sm, md, lg
            @endmarkdown

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'sm'],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'background' => false
            ])
            @endbutton

            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'lg'],
                'background' => false,
            ])
            @endbutton

        </div>
    </div>
        @markdown
            ####With background, primary and secondary   
        @endmarkdown
        
        @button([
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'white', 'size' => 'sm'],
            'background' => 'primary'
        ])
        @endbutton

        @button([
            'isIconButton' =>  true,
            'icon' => ['name' => 'close', 'color' => 'white', 'size' => 'md'],
            'background' => 'secondary'
        ])
        @endbutton
    
    @enddoc
@stop



        