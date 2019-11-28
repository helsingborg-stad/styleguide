@extends('layout.master')

@section('content')
<article>

    @markdown
        #Spacing (Margin & Padding)
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing']])
        <div class="grid">
            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1011',
                    'title' => ['text' => 'Padding top is base * 6', 'position' => 'top'],
                    'byline' => ['text' => 'Gives a bit more whitespace', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-padding__top--6'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
            
            </div>
    
            <div class="grid-s-12 grid-md-6">
                @card([
                        'href' => '#',
                        'image' => 'https://picsum.photos/300/225?image=1011',
                        'title' => ['text' => 'Margin on X-axis is base * 6', 'position' => 'top'],
                        'byline' => ['text' => 'Gives a bit more breathing room', 'position' => 'top'],
                        'classList' => ['c-card--shadow-on-hover', 'u-margin__x--6'],
                        'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                        därmed annat ännu söka.',
                        'hasRipple' => false
                    ])
    
                @endcard
    
            </div>
        </div>
    @endutility_doc

</article>
@stop
