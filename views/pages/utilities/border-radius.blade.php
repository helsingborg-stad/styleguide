@extends('layout.containers.doc')

@section('doc-content')
    @markdown
            #Border radius
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'border-radius', 'config' => 'border-radius']])

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
            <div class="u-rounded u-color__bg--primary"></div>
            <div class="u-rounded--full u-color__bg--primary"></div>
            <div class="u-rounded--none u-color__bg--primary"></div>
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
            <div class="u-rounded__top--16 u-color__bg--primary"></div>
            <div class="u-rounded__right--16 u-color__bg--primary"></div>
            <div class="u-rounded__bottom--16 u-color__bg--primary"></div>
            <div class="u-rounded__left--16 u-color__bg--primary"></div>
        </div>

        <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>

        @typography([
            'variant' => 'headline',
            'classList' => [
                'u-color__text--primary',
                'u-margin__bottom--0',
            ]
        ])
            Corner specific
        @endtypography

        @typography([])
            Here we've only applied border radius to the sides.
        @endtypography

        <div class="d-border d-border--sides">
            <div class="u-rounded__top__left--16 u-color__bg--primary"></div>
            <div class="u-rounded__top__right--16 u-color__bg--primary"></div>
            <div class="u-rounded__bottom__right--16 u-color__bg--primary"></div>
            <div class="u-rounded__bottom__left--16 u-color__bg--primary"></div>
            
        </div>

        <div class="g-divider g-divider--md u-margin__top--8 u-margin__bottom--10"></div>

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
            Let's say you want to create a chat bubble. First we make the whole box rounded.
            To complete the look we can remove the border radius of one of the corners.
        @endtypography

        <div class="d-border d-border--sides">
            <div class="u-rounded u-rounded__bottom__left--0 u-color__bg--primary"></div>
        </div>
        
    @endutility_doc

@stop