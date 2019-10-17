@extends('layout.master')

@section('content')
<article>

    @markdown
        #Spacing (Margin & Padding)
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'spacing', 'config' => 'spacing']])
        <div class="grid">
            <div class="grid-s-12 grid-md-6 u-padding__left--6">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Padding left is base * 6',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
                dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
                rännil.'
                ])
    
                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-6 u-margin__y--7">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Margin on Y-axis is base * 7',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu söka, från se ingalunda dag vi äng plats är. Söka denna erfarenheter flera vidsträckt fram
                dock stora söka, genom dimma blivit enligt vemod söka nya gör annan, mot annat där enligt faktor dimma
                rännil.'
    
                ])
    
                @endcard
    
            </div>
        </div>
    @endutility_doc

</article>
@stop
