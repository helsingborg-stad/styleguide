@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Segments (sections)

            The sections componet are specifically build to contain other components. The component creates a full-page container with a layout. It will work as long as the current container is centered. The component automatically bleeds beyond the container.
        ')
    !!}

@endsection

@section('hero')

    @segment([
        'containContent' => true, 
        'height' => 'md',
        'width' => 'lg',
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Kranvatten är gott, färskt, lokalproducerat och kostar bara 4 öre per liter."
        ],
        'article_body' => "Flaskvatten kostar minst 250 gånger mer, förpackas i plast och transporteras långa sträckor.",
        'image' => "https://picsum.photos/id/1012/3973/2639"
    ])

    @endsegment

@stop
