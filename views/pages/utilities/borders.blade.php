@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Borders
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'borders', 'config' => 'borders']])

        @typography([
            'variant' => 'headline',
            'classList' => [
                'u-color__text--primary',
                'u-margin__bottom--0',
            ]
        ])
            The basics
        @endtypography

        @typography([])
            The first box has only the base class applied. The second has the modifier "full" which gives it a round apperance.
            The last one has the modifier "none" which remove border radius from all sides.
        @endtypography

        <div class="d-border">
            <div class="u-border"></div>
            <div class="u-border--2"></div>
            <div class="u-rounded--none"></div>
        </div>

        <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>

        @typography([
            'variant' => 'headline',
            'classList' => [
                'u-color__text--primary',
                'u-margin__bottom--0',
            ]
        ])
            Side specific
        @endtypography

        @typography([])
            Here we've only applied border radius to the sides.
        @endtypography

        <div class="d-border d-border--sides">
            <div class="u-border__top"></div>
            <div class="u-border__right"></div>
            <div class="u-border__left"></div>
            <div class="u-border__bottom"></div>
        </div>

        <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>

        @typography([
            'variant' => 'headline',
            'classList' => [
                'u-color__text--primary',
                'u-margin__bottom--0',
            ]
        ])
            More examples
        @endtypography

        @typography([])
            Here we have a few more usage cases. The first box has the border base class and then removed the border on the top.
            The second box has a thicker border on the right and the last box has border applied on the left side and in the bottom.
        @endtypography

        <div class="d-border d-border--sides">
            <div class="u-border u-border__top--0"></div>
            <div class="u-border u-border__right--2"></div>
            <div class="u-border--2 u-border__top--0 u-border__right--0"></div>
        </div>
        
    @endutility_doc

    @markdown
        ###Border colors
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'borders', 'config' => 'borders-colors']])

        @typography([
            'variant' => 'headline',
            'classList' => [
                'u-color__text--primary',
                'u-margin__bottom--0',
            ]
        ])
            Colors
        @endtypography

        @typography([])
            Border colors can be applied. Here they are:
        @endtypography

        <div class="d-border d-border--colors">
            <div class="u-border"></div>
            <div class="u-border u-border__color--secondary"></div>
            <div class="u-border u-border__color--info"></div>
            <div class="u-border u-border__color--warning"></div>
            <div class="u-border u-border__color--danger"></div>
            <div class="u-border u-border__color--success"></div>
        </div>
        
    @endutility_doc

</article>
@stop
