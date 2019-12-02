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
                    'name' => 'Kendal Ozzel',
                    'title' => 'Admiral',
                    'testimonial' => 'Bacon ipsum dolor amet pork chop picanha rump turducken meatball sausage spare ribs porchetta bacon. ',
                    'image' => 'https://picsum.photos/200/200?image=1022'
                ),
                array(
                    'name' => 'Maximilian Veers',
                    'title' => 'General',
                    'testimonial' => 'Swine shank landjaeger, tail bacon meatloaf biltong drumstick jerky filet mignon.',
                    'image' => 'https://picsum.photos/200/200?image=1023'
                ),
                array(
                    'name' => 'Shaef Corssin',
                    'title' => 'Captain',
                    'testimonial' => 'Pork belly porchetta pork loin meatloaf pastrami buffalo ball tip tenderloin, tail kevin pig alcatra tri-tip bacon. ',
                    'image' => 'https://picsum.photos/200/200?image=1024'
                ),
            )]
        )
        @endtestimonials
    @enddoc
@stop
