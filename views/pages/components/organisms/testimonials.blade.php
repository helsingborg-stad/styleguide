@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Testimonials
    @endmarkdown

    @doc(['slug' => 'testimonials'])
        @testimonials(
            ['perRow' => 1,
            'testimonials' => array(
                array(
                    'name' => 'David Conradi',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => 'Det bästa med Filbornaskolan är bredden på programutbudet samt att all personal är engagerad och arbetar mot samma mål. Våra elever ska gå vidare från Filbornaskolan med så mycket kunskap och goda erfarenheter som möjligt.',
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                ),
                array(
                    'name' => 'David Conradi',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => '"Det är så himla roligt att undervisa ungdomar och att lära av dem. Elever som anstränger sig lyckas och att se glädjen i deras ögon när det sker, är det bästa som finns. De ögonblicken lever jag länge på."',
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                ),
                array(
                    'name' => 'David Conradi',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => '"Det är så himla roligt att undervisa ungdomar och att lära av dem. Elever som anstränger sig lyckas och att se glädjen i deras ögon när det sker, är det bästa som finns. De ögonblicken lever jag länge på."',
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                ),
                array(
                    'name' => 'David Conradi',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => '"Det är så himla roligt att undervisa ungdomar och att lära av dem. Elever som anstränger sig lyckas och att se glädjen i deras ögon när det sker, är det bästa som finns. De ögonblicken lever jag länge på."',
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                )
            )]
        )
        @endtestimonials

        @testimonials(
            ['perRow' => 1,
            'testimonials' => array(
                array(
                    'name' => 'Mr Long Name Senior af Helsingborg',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => 'Det bästa med Filbornaskolan är bredden på programutbudet samt att all personal är engagerad och arbetar mot samma mål. Våra elever ska gå vidare från Filbornaskolan med så mycket kunskap och goda erfarenheter som möjligt.',
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                )
            )]
        )
        @endtestimonials
    @enddoc

@stop
