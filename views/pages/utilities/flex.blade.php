@extends('layout.master')

@section('content')
<article>

    @markdown
        #Flex Box
        Uses <code>u-display-flex</code>

        ###Align Content
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-content']])
        <div class="grid" style="height: 200px;">
                <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--start u-border--2">
                    <div class="u-border u-width--50 u-height--50">Start</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--end u-border--2">
                    <div class="u-border u-width--50 u-height--50">End</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--center u-border--2">
                        <div class="u-border u-width--50 u-height--50">Center</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--stretch u-border--2">
                        <div class="u-border u-width--50">Stretch</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--around u-border--2">
                        <div class="u-border u-width--50 u-height--50">around</div>
                </div>
        </div>
        

    @endutility_doc

    @markdown
    ###Align Items
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-items']])

        <div class="grid" style="height: 200px;">
            <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-items--start u-border--2">
                <div class="u-border u-width--50 u-height--50">Start</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-items--end u-border--2">
                <div class="u-border u-width--50 u-height--50">End</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--center u-border--2">
                    <div class="u-border u-width--50 u-height--50">Center</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--stretch u-border--2">
                    <div class="u-border u-width--50">Stretch</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display-flex u-flex-wrap u-align-content--baseline u-border--2">
                    <div class="u-border u-width--50 u-height--50">around</div>
            </div>
        </div>
            
    @endutility_doc

    @markdown
    ###Align Self
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-self']])

        <div style="height:200px;" class="u-display-flex u-flex-wrap u-border--2">
            <div class="u-border u-width--25 u-height--50 u-align-self--start">Start</div>
            <div class="u-border u-width--25 u-height--50 u-align-self--end">End</div>
            <div class="u-border u-width--25 u-height--50 u-align-self--center">Center</div>
            <div class="u-border u-width--25  u-align-self--stretch">Stretch</div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Direction
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-direction']])
        <div class="grid">
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display-flex u-flex-wrap u-flex-direction--row u-border--2">
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row 1</div>
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display-flex u-flex-wrap u-flex-direction--column u-border--2">
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column 1</div>
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display-flex u-flex-wrap u-flex-direction--row--reverse u-border--2">
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row reverse 1</div>
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row reverse 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display-flex u-flex-wrap u-flex-direction--column--reverse u-border--2">
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column reverse 1</div>
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column reverse 2</div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Grow
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-grow']])
        <div class="grid">
            <div class="grid-xs-6 grid-md-6 u-display-flex u-flex-wrap u-border--2 u-p--2">
                <div class="u-border  u-flex-grow--0">Grow 0</div>
                <div class="u-border  u-flex-grow--1">Grow 1</div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Shrink
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-shrink']])
       
            <div style="width=300px;"class="u-display-flex u-border--2 u-p--2">
                <div class="u-border u-width--100">Width 100%</div>
                <div class="u-border u-flex-shrink--0">Shrink 0</div>
                <div class="u-border u-flex-shrink--1">Shrink 1</div>
            </div>
        
    @endutility_doc

    @markdown
    ###Flex Wrap
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-wrap']])
        
        <div style="width=300px;"class="u-display-flex u-flex-wrap u-p--2 u-color__bg--success">
            <div class="u-border u-width--50">Default 1</div>
            <div class="u-border u-width--50">Default 2</div>
            <div class="u-border u-width--50">Default 3</div>
        </div>
        <div style="width=300px;"class="u-display-flex u-flex-wrap--no-wrap u-color__bg--success u-p--2 u-my--2">
                <div class="u-border u-width--50">No-wrap 1</div>
                <div class="u-border u-width--50">No-wrap 2</div>
                <div class="u-border u-width--50">No-wrap 3</div>
        </div>
        <div style="width=300px;"class="u-display-flex u-flex-wrap--reverse u-color__bg--success u-p--2">
                <div class="u-border u-width--50">Reverse 1</div>
                <div class="u-border u-width--50">Reverse 2</div>
                <div class="u-border u-width--50">Reverse 3</div>
        </div>
    @endutility_doc

    @markdown
    ###Justify Content
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'justify-content']])
        <div class="grid">
            <div style="width=300px;"class="grid-md-4 u-display-flex u-justify-content--start u-color__bg--success">
                <div class="u-border u-width--25">Start 1</div>
                <div class="u-border u-width--25">Start 2</div>
                <div class="u-border u-width--25">Start 3</div>
            </div>
            <div style="width=300px;"class="grid-md-4 u-display-flex u-justify-content--end u-color__bg--info">
                <div class="u-border u-width--25">End 1</div>
                <div class="u-border u-width--25">End 2</div>
                <div class="u-border u-width--25">End 3</div>
            </div>
            <div style="width=300px;"class="grid-md-4  u-display-flex u-justify-content--center u-color__bg--warning">
                <div class="u-border u-width--25">Center 1</div>
                <div class="u-border u-width--25">Center 2</div>
                <div class="u-border u-width--25">Center 3</div>
            </div>
            <div style="width=300px;"class="grid-md-4 u-display-flex u-justify-content--space-between u-color__bg--success">
                <div class="u-border u-width--25">Space Between 1</div>
                <div class="u-border u-width--25">Space Between 2</div>
                <div class="u-border u-width--25">Space Between 3</div>
            </div>
            <div style="width=300px;"class="grid-md-4 u-display-flex u-justify-content--space-around u-color__bg--info">
                <div class="u-border u-width--25">Space Around 1</div>
                <div class="u-border u-width--25">Space Around 2</div>
                <div class="u-border u-width--25">Space Around 3</div>
            </div>
            <div style="width=300px;"class="grid-md-4 u-display-flex u-justify-content--space-evenly u-color__bg--warning">
                <div class="u-border u-width--25">Space Evenly 1</div>
                <div class="u-border u-width--25">Space Evenly 2</div>
                <div class="u-border u-width--25">Space Evenly 3</div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Order
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'order']])
        <div class="u-display-flex">
            <div class="u-order--0 u-p--1 u-mx--1 u-color__bg--warning">0</div>
            <div class="u-order--1 u-p--1 u-mx--1 u-color__bg--warning">1</div>
            <div class="u-order--2 u-p--1 u-mx--1 u-color__bg--warning">2</div>
            <div class="u-order--3 u-p--1 u-mx--1 u-color__bg--warning">3</div>
            <div class="u-order--9 u-p--1 u-mx--1 u-color__bg--warning">4</div>
            <div class="u-order--11 u-p--1 u-mx--1 u-color__bg--warning">5</div>
            <div class="u-order--10 u-p--1 u-mx--1 u-color__bg--warning">6</div>
            <div class="u-order--12 u-p--1 u-mx--1 u-color__bg--warning">7</div>
            <div class="u-order--8 u-p--1 u-mx--1 u-color__bg--warning">8</div>
            <div class="u-order--6 u-p--1 u-mx--1 u-color__bg--warning">9</div>
            <div class="u-order--7 u-p--1 u-mx--1 u-color__bg--warning">10</div>
            <div class="u-order--5 u-p--1 u-mx--1 u-color__bg--warning">11</div>
            <div class="u-order--4 u-p--1 u-mx--1 u-color__bg--warning">12</div>

        </div>
    @endutility_doc

</article>
@stop
