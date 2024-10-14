@hero([
    "image" => "https://picsum.photos/id/1026/1500/1000",
    'heroView' => 'twoColumn'
])
    @slot('content')
        @typography([
            'variant' => 'h1'
        ])
            This is a title
        @endtypography
        @typography([
            'variant' => 'body'
        ])
            Nullam quis risus eget urna mollis ornare vel eu leo. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla.
        @endtypography
    @endslot
@endhero