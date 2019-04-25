@extends('layout.master')

@section('content')
    @markdown
        # Testimonials
    @endmarkdown

    @doc(['slug' => 'testimonials'])
        @testimonials(['testimonials' => array(
            array(
                'name' => 'Curabitur blandit',
                'title' => 'Tempus porttitor',
                'testimonial' => 'Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor.',
                'image' => 'https://picsum.photos/300/200?image=1026'
            ),
            array(
                'name' => 'Curabitur blandit',
                'title' => 'Tempus porttitor',
                'testimonial' => 'Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor.',
                'image' => 'https://picsum.photos/300/200?image=1026'
            ),
        )])
        @endtestimonials
    @enddoc
@stop
