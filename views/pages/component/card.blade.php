@extends('layout.master')

@section('content')

    @markdown
    #Cards

    Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    @endmarkdown

    @doc(['slug' => 'card', 'displayParams' => false])

    <div class="grid">

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'title' => ['text' => 'I am pretty nice a title', 'position' => 'body'],
                'byline' => ['text' => 'I am cool byline....', 'position' => 'body'],
                'content' => 'Doodily texas left rappin surfer assal horizontology mono = one craptacular bumbled-bee.',
                'hasRipple' => false
            ])

            @endcard

        </div>

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
                'title' => ['text' => 'Another title with a few more words. Two lines of text.', 'position' => 'body'],
                'byline' => ['text' => 'Neglecterino nulecule four krustys flunjer parents', 'position' => 'body'],
                'buttons' => [
                    [
                        'href' => 'http://helsingborg.se',
                        'text' => 'Action button 1',
                        'attributeList' => ['js-toggle-trigger']
                    ],
                    [
                        'href' => 'http://',
                        'text' => 'Action button 2',
                        'attributeList' => ['js-toggle-trigger']
                    ]
                ]
            ])

            @endcard

        </div>
    </div>

    @enddoc

    @doc(['slug' => 'card'])

        @markdown
        ##Position of Title and byline

        There are two positions slots available for title and byline. Top and Body.

        @endmarkdown

        <div class="grid">

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1077',
                    'title' => ['text' => 'I am pretty nice a title', 'position' => 'top'],
                    'byline' => ['text' => 'You all know what laughter sounds like', 'position' => 'top'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                            därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
                            dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
                            rännil.',
                    'hasRipple' => false
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-sm-6 grid-md-6">
                @card([
                    'href' => 'http://styleguide.helsingborg.se/card',
                    'image' => 'https://picsum.photos/300/200?image=1077',
                    'title' => ['text' => 'I am pretty nice a title', 'position' => 'body'],
                    'byline' => ['text' => 'You all know what laughter sounds like', 'position' => 'body'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                        därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
                        dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
                        rännil.',
                    'hasRipple' => false

                ])

                @endcard

            </div>
        </div>

    @enddoc

    @doc(['slug' => 'card'])

    @markdown
    ##Position of Title and byline

    There are two positions slots available for title and byline. Top and Body.

    @endmarkdown

    <div class="grid">

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
            'href' => 'http://styleguide.helsingborg.se/card',
            'image' => 'https://picsum.photos/300/200?image=1077',
            'title' => ['text' => 'I am pretty nice a title', 'position' => 'top'],
            'byline' => ['text' => 'You all know what laughter sounds like', 'position' => 'top'],
            'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
            därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
            dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
            rännil.',
            'hasRipple' => false
            ])

            @endcard

        </div>

        <div class="grid-s-12 grid-sm-6 grid-md-6">
            @card([
            'href' => 'http://styleguide.helsingborg.se/card',
            'image' => 'https://picsum.photos/300/200?image=1077',
            'title' => ['text' => 'I am pretty nice a title', 'position' => 'body'],
            'byline' => ['text' => 'You all know what laughter sounds like', 'position' => 'body'],
            'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
            därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
            dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
            rännil.',
            'hasRipple' => false

            ])

            @endcard

        </div>
    </div>

    @enddoc



@stop




