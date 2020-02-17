@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Flex Box
        Uses <code>u-display--flex</code>

        ###Align Content
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-content']])
        <div class="grid" style="height: 200px;">
                <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--start u-border--2">
                    <div class="u-border u-width--50 u-height--50">Start</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--end u-border--2">
                    <div class="u-border u-width--50 u-height--50">End</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--center u-border--2">
                        <div class="u-border u-width--50 u-height--50">Center</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--stretch u-border--2">
                        <div class="u-border u-width--50">Stretch</div>
                </div>
                <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--around u-border--2">
                        <div class="u-border u-width--50 u-height--50">around</div>
                </div>
        </div>
        

    @endutility_doc

    @markdown
    ###Align Items
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-items']])

        <div class="grid" style="height: 200px;">
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-items--start u-border--2">
                <div class="u-border u-width--50 u-height--50">Start</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-items--end u-border--2">
                <div class="u-border u-width--50 u-height--50">End</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--center u-border--2">
                    <div class="u-border u-width--50 u-height--50">Center</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--stretch u-border--2">
                    <div class="u-border u-width--50">Stretch</div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--baseline u-border--2">
                    <div class="u-border u-width--50 u-height--50">around</div>
            </div>
        </div>
            
    @endutility_doc

    @markdown
    ###Align Self
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-self']])

        <div style="height:200px;" class="u-display--flex u-flex-wrap u-border--2">
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
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--row u-border--2">
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row 1</div>
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--column u-border--2">
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column 1</div>
                <div class="u-border u-width--25 u-height--25 u-align-self--start">Column 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--row--reverse u-border--2">
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row reverse 1</div>
                <div class="u-border u-width--25 u-height--50 u-align-self--start">Row reverse 2</div>
            </div>
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--column--reverse u-border--2">
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
            <div class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-border--2 u-p--2">
                <div class="u-border  u-flex-grow--0">Grow 0</div>
                <div class="u-border  u-flex-grow--1">Grow 1</div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Shrink
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-shrink']])
       
            <div style="width=300px;"class="u-display--flex u-border--2 u-p--2">
                <div class="u-border u-width--100">Width 100%</div>
                <div class="u-border u-flex-shrink--0">Shrink 0</div>
                <div class="u-border u-flex-shrink--1">Shrink 1</div>
            </div>
        
    @endutility_doc

    @markdown
    ###Flex Wrap
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-wrap']])

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            Default breaks line if needed
        @endtypography
        
        <div class="u-display--flex u-flex-wrap u-p--2 u-color__bg--primary u-padding--2 u-rounded u-text__align--center">
            <div class="u-color__bg--info u-width--50 u-rounded">Default 1</div>
            <div class="u-color__bg--info u-width--50 u-rounded">Default 2</div>
            <div class="u-color__bg--info u-width--50 u-rounded">Default 3</div>
        </div>

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            No-wrap prevents flex from breaking line
        @endtypography

        <div class="u-display--flex u-flex-wrap--no-wrap u-color__bg--primary u-p--2 u-padding--2  u-rounded">
                <div class="u-color__bg--info u-width--50 u-rounded">No-wrap 1</div>
                <div class="u-color__bg--info u-width--50 u-rounded">No-wrap 2</div>
                <div class="u-color__bg--info u-width--50 u-rounded">No-wrap 3</div>
        </div>

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            Flex wrap-reverse acts like default value just reverse order
        @endtypography

        <div class="u-display--flex u-flex-wrap--reverse u-color__bg--primary u-padding--2  u-rounded">
                <div class="u-color__bg--info u-width--50 u-rounded">Reverse 1</div>
                <div class="u-color__bg--info u-width--50 u-rounded">Reverse 2</div>
                <div class="u-color__bg--info u-width--50 u-rounded">Reverse 3</div>
        </div>
    @endutility_doc

    @markdown
    ###Justify Content
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'justify-content']])
        <div class="grid">
            <div class="u-display--flex u-justify-content--start u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Start 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Start 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Start 3</div>
            </div>
            <div class="u-display--flex u-justify-content--end u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">End 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">End 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">End 3</div>
            </div>
            <div class="u-display--flex u-justify-content--center u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Center 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Center 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Center 3</div>
            </div>
            <div class="u-display--flex u-justify-content--space-between u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Between 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Between 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Between 3</div>
            </div>
            <div class="u-display--flex u-justify-content--space-around u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Around 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Around 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Around 3</div>
            </div>
            <div class="u-display--flex u-justify-content--space-evenly u-color__bg--primary u-padding--2 u-rounded">
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Evenly 1</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Evenly 2</div>
                <div class="u-color__bg--secondary u-rounded u-width--25 u-padding--1">Space Evenly 3</div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Order
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'order']])
        <div class="u-display--flex u-flex-wrap">
            <div class="u-order--0 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">0</div>
            <div class="u-order--1 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">1</div>
            <div class="u-order--2 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">2</div>
            <div class="u-order--3 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">3</div>
            <div class="u-order--9 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">4</div>
            <div class="u-order--11 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">5</div>
            <div class="u-order--10 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">6</div>
            <div class="u-order--12 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">7</div>
            <div class="u-order--8 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">8</div>
            <div class="u-order--6 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">9</div>
            <div class="u-order--7 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">10</div>
            <div class="u-order--5 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">11</div>
            <div class="u-order--4 u-padding--1 u-margin__x--1 u-color__bg--primary u-rounded u-color__text--secondary">12</div>

        </div>
    @endutility_doc

</article>
@stop
