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
                    'name' => 'अच्छा काम अच्छा है',
                    'title' => ' Dalai Lama, Spiritual and political leader of Tibetans',
                    'titleElement' => 'h5',
                    'testimonial' => "Anger and hatred are signs of weakness, while compassion is a sure sign of strength. Bless this component...",
                    'image' => 'https://picsum.photos/200/200?image=1022',
                    'quoteColor' => 'primary'
                ),
                array(
                    'name' => "WOW! Can't believe it.",
                    'title' => 'Jesse Owens, American track athlete.',
                    'titleElement' => 'h5',
                    'testimonial' => "For a time, at least, I was the most famous person in the entire world. Great work dudes!",
                    'image' => 'https://picsum.photos/200/200?image=1023',
                    'quoteColor' => 'secondary'
                ),
                array(
                    'name' => 'This is all you need...',
                    'title' => 'John Lennon, musician and member of the Beatles',
                    'testimonial' => "Everything will be okay in the end. If it’s not okay, it’s not the end. Love your stuff, Peace!",
                    'titleElement' => 'h5',
                    'image' => 'https://picsum.photos/200/200?image=1024',
                    'quoteColor' => 'grey'
                ),
                array(
                    'name' => 'È un capolavoro!!!!!',
                    'title' => 'Leonardo da Vinci',
                    'testimonial' => "Blinding ignorance does mislead us. Oh! Wretched mortals, open your eyes! Keep up the good work.",
                    'titleElement' => 'h5',
                    'image' => 'https://picsum.photos/200/200?image=1012',
                    'imageTop' => true
                ),
                array(
                    'name' => 'Excellent work lads!',
                    'title' => 'Alfred Hitchcock',
                    'testimonial' => "A lot of movies are about life, mine are like a slice of cake. Yummi styleguide!",
                    'titleElement' => 'h5',
                    'image' => 'https://picsum.photos/200/200?image=1013',
                    'imageTop' => true
                ),
                array(
                    'name' => "Splendid honey!",
                    'title' => 'Audrey Hepburn',
                    'testimonial' => "Let's face it, a nice creamy chocolate cake does a lot for a lot of people; it does for me.",
                    'titleElement' => 'h5',
                    'image' => 'https://picsum.photos/200/200?image=1014',
                    'imageTop' => true
                ),
            )]
        )
        @endtestimonials
    @enddoc

@stop
