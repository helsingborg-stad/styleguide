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
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--start u-color__bg--default u-margin--1 u-rounded">
                <div class="u-color__bg--primary u-width--50 u-height--50 u-rounded"></div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--end u-color__bg--default u-margin--1 u-rounded">
                <div class="u-color__bg--primary u-width--50 u-height--50 u-rounded"></div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--center u-color__bg--default u-margin--1 u-rounded">
                <div class="u-color__bg--primary u-width--50 u-height--50 u-rounded"></div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--stretch u-color__bg--default u-margin--1 u-rounded">
                <div class="u-color__bg--primary u-width--50 u-rounded"></div>
            </div>
            <div class="grid-xs-6 grid-md-3 u-display--flex u-flex-wrap u-align-content--around u-color__bg--default u-margin--1 u-rounded">
                <div class="u-color__bg--primary u-width--50 u-height--50 u-rounded"></div>
            </div>
        </div>

    @endutility_doc

    @markdown
    ###Align Items
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-items']])

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            <code>u-align-items--start</code>
        @endtypography
        <div class="u-display--flex u-flex-wrap u-align-items--start u-color__bg--default u-rounded u-padding__x--2 u-margin__bottom--2" style="height: 100px;">
            <div class="u-color__bg--primary u-height--50 u-rounded">
                <code>u-align-items--start</code>
            </div>
        </div>

        <div class="u-display--flex u-flex-wrap u-align-items--end u-color__bg--default u-rounded u-padding__x--2 u-margin__bottom--2" style="height: 100px;">
            <div class="u-color__bg--primary u-height--50 u-rounded">
                <code>u-align-items--end</code>
            </div>
        </div>

        <div class="u-display--flex u-flex-wrap u-align-content--center u-color__bg--default u-rounded u-padding__x--2 u-margin__bottom--2" style="height: 100px;">
            <div class="u-color__bg--primary u-height--50 u-rounded">
                <code>u-align-content--center</code>
            </div>
        </div>

        <div class="u-display--flex u-flex-wrap u-align-content--stretch u-color__bg--default u-rounded u-padding__x--2 u-margin__bottom--2" style="height: 100px;">
            <div class="u-color__bg--primary u-rounded">
                <code>u-align-content--stretch</code>
            </div>
        </div>

        <div class="u-display--flex u-flex-wrap u-align-content--baseline u-color__bg--default u-rounded u-padding__x--2 u-margin__bottom--2" style="height: 100px;">
            <div class="u-color__bg--primary u-height--50 u-rounded">
                <code>u-align-content--baseline</code>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Align Self
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'align-self']])

        <div style="height:200px;" class="u-display--flex u-flex-wrap u-color__bg--default u-rounded u-padding--1"x>
            <div class="u-width--25 u-height--50 u-align-self--start u-color__bg--primary u-rounded">
                <code>Start</code>
            </div>

            <div class="u-width--25 u-height--50 u-align-self--end u-color__bg--primary u-rounded">
                <code>End</code>
            </div>

            <div class="u-width--25 u-height--50 u-align-self--center u-color__bg--primary u-rounded">
                <code>Center</code>
            </div>

            <div class="u-width--25  u-align-self--stretch u-color__bg--primary u-rounded">
                <code>Stretch</code>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Direction
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-direction']])
        <div class="grid">
            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                <code>u-flex-direction--row</code>
            @endtypography
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--row u-rounded u-color__bg--default">
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--50"></div>
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--50"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                <code>u-flex-direction--column</code>
            @endtypography
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--column u-rounded u-color__bg--default">
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--25"></div>
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--25"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                <code>u-flex-direction--row--reverse</code>
            @endtypography
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--row--reverse u-rounded u-color__bg--default">
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--50"></div>
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--50"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                <code>u-flex-direction--column--reverse</code>
            @endtypography
            <div style="height:200px;" class="grid-xs-6 grid-md-6 u-display--flex u-flex-wrap u-flex-direction--column--reverse u-rounded u-color__bg--default">
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--25"></div>
                <div class="u-rounded u-color__bg--secondary u-width--25 u-height--25"></div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Grow
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-grow']])

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            With <code>u-flex-grow</code> we can choose in which element to prioritise growth to.
        @endtypography

        <div class="u-display--flex u-color__bg--default  u-flex-wrap u-rounded u-padding--2">
            <div class="u-color__bg--primary u-rounded u-padding u-flex-grow--0"><code>u-flex-grow--0</code></div>
            <div class="u-color__bg--secondary u-rounded u-padding u-flex-grow--1"><code>u-flex-shrink--1</code></div>
        </div>
    @endutility_doc

    @markdown
    ###Flex Shrink
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-shrink']])

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            With <code>u-flex-shrink</code> we can choose in which element to prioritise shrinking to.
        @endtypography
       
        <div style="width=300px;"class="u-color__bg--default u-display--flex u-rounded u-padding--2">
            <div class="u-color__bg--primary u-padding--2 u-rounded u-width--100"><code>u-width--100</code></div>
            <div class="u-color__bg--info u-padding--2 u-rounded u-flex-shrink--0"><code>u-flex-shrink--0</code></div>
            <div class="u-color__bg--secondary u-padding--2 u-rounded u-flex-shrink--1"><code>u-flex-shrink--1</code></div>
        </div>
        
    @endutility_doc

    @markdown
    ###Flex Wrap
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'flex-wrap']])

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            Default breaks line if needed
        @endtypography
        
        <div class="u-display--flex u-flex-wrap u-color__bg--default u-padding--2 u-rounded u-text__align--center">
            <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
            <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
            <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
        </div>

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            No-wrap prevents flex from breaking line
        @endtypography

        <div class="u-display--flex u-flex-wrap--no-wrap u-color__bg--default u-padding--2  u-rounded">
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
        </div>

        @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
            Flex wrap-reverse acts like default value just reverse order
        @endtypography

        <div class="u-display--flex u-flex-wrap--reverse u-color__bg--default u-padding--2  u-rounded">
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
                <div class="u-color__bg--primary u-padding--2 u-width--50 u-rounded"></div>
        </div>
    @endutility_doc

    @markdown
    ###Justify Content
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'justify-content']])
        <div class="grid">
            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                Start
            @endtypography
            <div class="u-display--flex u-justify-content--start u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                End
            @endtypography
            <div class="u-display--flex u-justify-content--end u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                Center
            @endtypography
            <div class="u-display--flex u-justify-content--center u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                Space Between
            @endtypography

            <div class="u-display--flex u-justify-content--space-between u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>

            @typography(['classList' => ['u-margin__top--4','u-margin__bottom--1']])
                Space Around
            @endtypography
            <div class="u-display--flex u-justify-content--space-around u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>

            @typography(['variant' => 'h3','classList' => ['u-margin__top--4','u-margin__bottom--1']])
                Space Evenly
            @endtypography

            <div class="u-display--flex u-justify-content--space-evenly u-color__bg--default u-padding--2 u-rounded">
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
                <div class="u-color__bg--primary u-rounded u-width--25 u-padding--1"></div>
            </div>
        </div>
    @endutility_doc

    @markdown
    ###Order
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'flex', 'config' => 'order']])
        <div class="u-display--flex u-flex-wrap">
            <div class="u-order--0 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">0</div>
            <div class="u-order--1 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">1</div>
            <div class="u-order--2 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">2</div>
            <div class="u-order--3 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">3</div>
            <div class="u-order--9 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">4</div>
            <div class="u-order--11 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">5</div>
            <div class="u-order--10 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">6</div>
            <div class="u-order--12 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">7</div>
            <div class="u-order--8 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">8</div>
            <div class="u-order--6 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">9</div>
            <div class="u-order--7 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">10</div>
            <div class="u-order--5 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">11</div>
            <div class="u-order--4 u-padding--1 u-margin__x--1 u-color__bg--default u-rounded u-color__text--secondary">12</div>

        </div>
    @endutility_doc

</article>
@stop
