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
                'text' => 'Size sm',
                'background' => 'default'
            ])
            @endbutton

            @button([
                'color' => 'secondary',
                'size' => 'md',
                'text' => 'Size md',
                'background' => 'default'
            ])
            @endbutton

            @button([
                'color' => 'secondary',
                'size' => 'lg',
                'text' => 'Size lg',
                'background' => 'default'
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
                'text' => 'Reversed',
                'background' => 'default'
            ])
            @endbutton

            @button([
                'icon' => ['name' => 'close', 'color' => 'black'],
                'text' => 'Not reversed',
                'background' => 'default'
            ])
            @endbutton

        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Different backgrounds    
            @endmarkdown
    
            @button([
                'background' => 'primary',
                'text' => 'Primary bg',
                'color' => 'white'
            ])
            @endbutton
    
            @button([
                'background' => 'secondary',
                'text' => 'Secondary bg',
                'color' => 'white'

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
                'text' => 'Animate + hover',
                'background' => 'default'
            ])
            @endbutton
    
            @button([
                'floating' => ['animate' => false, 'hover' => true],
                'text' => 'Only hover',
                'background' => 'default'
            ])
            @endbutton
    
            @button([
                'floating' => ['animate' => false, 'hover' => false],
                'text' => 'No hover or animate',
                'background' => 'default'
            ])
            @endbutton
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Outlined buttons
            @endmarkdown
            @button([
                'text' => 'Primary toggle',
                'isOutlined' => true
            ])
            @endbutton

            @button([
                'text' => 'Secondary outlined',
                'isOutlined' => true,
                'color' => 'secondary'
            ])
            @endbutton

            @button([
                'text' => 'Default outlined',
                'isOutlined' => true,
                'color' => 'default'
            ])
            @endbutton
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Outlined buttons with toggle  
            @endmarkdown
            @button([
                'text' => 'Primary outlined',
                'toggle' => true,
                'isOutlined' => true,
                'color' => 'primary'
            ])
            @endbutton

            @button([
                'text' => 'Secondary outlined',
                'toggle' => true,
                'isOutlined' => true,
                'color' => 'secondary'
            ])
            @endbutton

            @button([
                'text' => 'Default outlined',
                'toggle' => true,
                'isOutlined' => true,
                'color' => 'default'
            ])
            @endbutton
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Disabled buttons
            @endmarkdown
            @button([
                'text' => 'Disabled',
                'background' => 'disabled',
                'attributeList' => ['js-toggle-trigger' => '', 'disabled' => '']
            ])
            @endbutton
            @button([
                'text' => 'Disabled outlined',
                'toggle' => true,
                'isOutlined' => true,
                'color' => 'disabled',
                'attributeList' => ['js-toggle-trigger' => '', 'disabled' => '']
            ])
            @endbutton
            @button([
                'isIconButton' =>  true,
                'icon' => ['name' => 'close', 'color' => 'black', 'size' => 'md'],
                'background' => 'primary',
                'attributeList' => ['disabled' => '']
            ])
            @endbutton
        </div>

        <div class="grid-s-12 grid-md-6">
            @markdown
                ###Text buttons
            @endmarkdown
            @button([
                'text' => 'Primary',
                'color' => 'primary'
            ])
            @endbutton

            @button([
                'text' => 'Secondary',
                'color' => 'secondary'
            ])
            @endbutton

            @button([
                'text' => 'Default',
                'color' => 'default'
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



        