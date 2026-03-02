@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Animations
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "animate", "config" => "animate"]])

        @typography([
            'element' => 'p'
        ])
            Animate elements, or sub elements to a container. You can choose from multiple predefined effects, defined by the styleguide. All animations in done with anime-js.
        @endtypography

        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Effects
        @endtypography

        @listing(
            [
            'list' => [
                    ['label' => 'fade'],
                    ['label' => 'fadeUp (Left, Right, Down)'],
                    ['label' => 'bounce'],
            ],
            'elementType' => "ul"
            ]
        )
        @endlisting

        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Bind
        @endtypography

        @typography([
            'element' => 'p'
        ])
            Two types of bind can be done, they are the following:
        @endtypography



        @listing(
            [
            'list' => [
                    ['label' => 'Scroll: Will animate in and out near the edges of the viewport (compatible with modern browsers)'],
                    ['label' => 'Onload: Will animate on load of the page. '],
            ],
            'elementType' => "ul"
            ]
        )
        @endlisting

        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Other
        @endtypography

        @typography([
            'element' => 'p'
        ])
            All animations will be triggerd automatically when toggling display: none, display: block.
        @endtypography



        @typography([
            'element' => 'h4',
            'variant' => 'subtitle'
        ])
            Library
        @endtypography

    @typography([
        'element' => 'p'
    ])
        We have chosen anime.js to create advanced animations swiftly. Like all javascript animation librarys it's always as performant that you would want. Therefore this library should be utilized where css-animations can't create the same effect.
    @endtypography

    @endscript_doc
@stop
