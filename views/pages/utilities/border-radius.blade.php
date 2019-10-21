@extends('layout.master')

@section('content')
    @markdown
            #Border radius
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'border-radius', 'config' => 'border-radius']])
        <div class="grid">

            <div class="grid-s-12 grid-md-6">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border radius to the left',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu söka.',
                "classList" => ['u-border--2', 'u-rounded-left--16']
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-md-6">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border radius on top left',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu söka.',
                "classList" => ['u-border--2', 'u-rounded-top-left--16']

                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-md-6">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border radius with full modifier',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu söka.',
                "classList" => ['u-border--2', 'u-border-radius--full']

                ])

                @endcard

            </div>



        </div>
    @endutility_doc

@stop