@extends('layout.master')

@section('content')
    @markdown
        #Accordion
        The accordion can be used to display larger lists of content on one page.
    @endmarkdown

    @doc(['slug' => 'accordion'])

        @accordion([
            'list'=> [
                ['heading' => "1", 'content' => "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, itaque cum a odio quibusdam iusto tempora voluptatum? Autem atque quod officiis, sed praesentium minima est eius a iste! Fuga, sapiente! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, itaque cum a odio quibusdam iusto tempora voluptatum? Autem atque quod officiis, sed praesentium minima est eius a iste! Fuga, sapiente!"],
                ['heading' => "2", 'content' => "Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor."],
                ['heading' => "3", 'content' => "Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor."],
                ['heading' => "4", 'content' => "Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor."]
            ]
        ])
        @endaccordion

    @enddoc
@stop
