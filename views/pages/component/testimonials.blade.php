@extends('layout.master')

@section('content')
    @markdown
        # Testimonials
    @endmarkdown

    @doc(['slug' => 'testimonials'])
        @testimonials(
            ['perRow' => 3,
            'testimonials' => array(
                array(
                    'name' => 'Dalai Lama',
                    'title' => 'Spiritual and political leader of Tibetans',
                    'titleElement' => 'h5',
                    'testimonial' => "Anger and hatred are signs of weakness, while compassion is a sure sign of strength. Bless this component...",
                    'image' => 'https://picsum.photos/200/200?image=1022',
                    'quoteColor' => 'primary'
                ),
                array(
                    'name' => 'Jesse Owens',
                    'title' => 'American track athlete, OS gold winner.',
                    'titleElement' => 'h5',
                    'testimonial' => "For a time, at least, I was the most famous person in the entire world. Great work dudes!",
                    'image' => 'https://picsum.photos/200/200?image=1023',
                    'quoteColor' => 'secondary'
                ),
                array(
                    'name' => 'John Lennon',
                    'title' => 'A great musician, member of the Beatles',
                    'testimonial' => "Everything will be okay in the end. If it’s not okay, it’s not the end. Love your stuff, Peace!",
                    'titleElement' => 'h5',
                    'image' => 'https://picsum.photos/200/200?image=1024',
                    'quoteColor' => 'grey'
                ),
                array(
                    'name' => 'Leonardo da Vinci',
                    'title' => 'Painter, scientist, polymath',
                    'testimonial' => "Blinding ignorance does mislead us. Oh! Wretched mortals, open your eyes! Keep up the good work.",
                    'image' => 'https://picsum.photos/200/200?image=1012',
                    'imageTop' => true
                ),
                array(
                    'name' => 'Alfred Hitchcock',
                    'title' => 'Film producer, director',
                    'testimonial' => "A lot of movies are about life, mine are like a slice of cake. Yummi styleguide!",
                    'image' => 'https://picsum.photos/200/200?image=1013',
                    'imageTop' => true
                ),
                array(
                    'name' => 'Audrey Hepburn',
                    'title' => 'Actress and humanitarian',
                    'testimonial' => "Let's face it, a nice creamy chocolate cake does a lot for a lot of people; it does for me.",
                    'image' => 'https://picsum.photos/200/200?image=1014',
                    'imageTop' => true
                ),
            )]
        )
        @endtestimonials
    @enddoc

@stop
