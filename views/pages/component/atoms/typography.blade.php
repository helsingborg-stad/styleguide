@extends('layout.master')

@section('content')
    @markdown
        #Typography
    @endmarkdown

    @doc(['slug' => 'typography'])
        @typography([
            "variant" => "h1",
            "element" => "h5",
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "h2",
            "element" => "h5"
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "h3",
            "element" => "h5",
            "classList" => ["u-margin--0"]
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "h4",
            "element" => "h2",
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "h5",
            "element" => "p"
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "h6",
        ])
            hejdsan
        @endtypography

        @typography([
            "variant" => "headline",
            "element" => "h5"
        ])
            Headline
        @endtypography

        @typography([
            "variant" => "title",
            "element" => "h5"
        ])
            Title
        @endtypography

        @typography([
            "variant" => "subtitle",
            "element" => "h5",
            "classList" => ["u-color__text--danger"]
        ])
            Subtitle
        @endtypography

        @typography([
            "variant" => "body",
            "element" => "span"
        ])
            Body
        @endtypography

        @typography([
            "variant" => "caption",
            "element" => "h5"
        ])
            Caption
        @endtypography
        
        @typography([
            "variant" => "meta",
            "element" => "h5"
        ])
            Meta
        @endtypography
    @enddoc
@stop
