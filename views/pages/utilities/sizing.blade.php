@extends('layout.master')

@section('content')
<article>

    @markdown
        #Vertical alignments

        ### Sizing width
    @endmarkdown
    

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_width']])
    <div class="grid" style="height:500px;">
    
            @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'WIDTH 25%',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu.',
                'classList' => ['u-width--25']
    
                ])
    
            @endcard
            @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'WIDTH 50%.',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu.',
                'classList' => ['u-width--50']
    
                ])
    
            @endcard
            
    </div>
    @endutility_doc    

    @markdown
      ### Sizing height
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_height']])
    <div class="grid" style="height:500px;">
    
            @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'HEIGHT 50%.',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu.',
                'classList' => ['u-width--50','u-height--50']
    
                ])
    
            @endcard
            @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'HEIGHT 75%.',
                'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                därmed annat ännu.',
                'classList' => ['u-width--50','u-height--75']
    
                ])
    
            @endcard
            
    </div>
    @endutility_doc  
    
</article>
@stop