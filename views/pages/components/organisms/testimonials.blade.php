@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Testimonials
    @endmarkdown

    @doc(['slug' => 'testimonials'])
        @testimonials(
            ['perRow' => 4,
            'testimonials' => array(
                array(
                    'name' => 'Alfred Nilsson',
                    'title' => ' Matematik- och idrottslärare',
                    'testimonial' => "Anger and hatred are signs of weakness, while compassion is a sure sign of strength. Bless this component...",
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                ),
                array(
                    'name' => "Eric Rosenborg",
                    'title' => 'Lärare i engelska och danska',
                    'testimonial' => "For a time, at least, I was the most famous person in the entire world. Great work dudes!",
                    'image' => 'https://cdn.vox-cdn.com/thumbor/I04LgBg2MHGcFb1F2Jc7pchQWbI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22795858/1195397540.jpg',
                ),
                array(
                    'name' => 'Johan Rehborg',
                    'title' => 'Lärare i svenska som andraspråk',
                    'testimonial' => "Everything will be okay in the end. If it’s not okay, it’s not the end. Love your stuff, Peace!",
                    'image' => 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg',
                ),
                array(
                    'name' => 'Johan Rehborg',
                    'title' => 'Lärare i svenska som andraspråk',
                    'testimonial' => "Everything will be okay in the end. If it’s not okay, it’s not the end. Love your stuff, Peace!",
                    'image' => 'https://cdn.vox-cdn.com/thumbor/I04LgBg2MHGcFb1F2Jc7pchQWbI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22795858/1195397540.jpg',
                )
            )]
        )
        @endtestimonials
    @enddoc

@stop
