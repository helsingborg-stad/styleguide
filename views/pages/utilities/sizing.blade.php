@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Sizing

        ### Sizing width
    @endmarkdown
    

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_width']])
    <div class="grid" style="height:500px;">
        @card([
            'href' => '#',
            'image' => 'https://picsum.photos/300/225?image=1011',
            'title' => ['text' => 'Width 50%', 'position' => 'top'],
            'byline' => ['text' => 'One size may not fit all', 'position' => 'top'],
            'classList' => ['c-card--shadow-on-hover', 'u-width--50'],
            'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla.',
            'hasRipple' => false
        ])

        @endcard

        @card([
            'href' => '#',
            'image' => 'https://picsum.photos/300/225?image=1011',
            'title' => ['text' => 'Width 25%', 'position' => 'top'],
            'byline' => ['text' => 'One size may not fit all', 'position' => 'top'],
            'classList' => ['c-card--shadow-on-hover', 'u-width--25'],
            'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla.',
            'hasRipple' => false
        ])

        @endcard
            
    </div>
    @endutility_doc    

    @markdown
      ### Sizing height
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'sizing', 'config' => 'sizing_height']])
        <div class="grid" style="height:500px;">
            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1011',
                    'title' => ['text' => 'Height 50%', 'position' => 'top'],
                    'byline' => ['text' => 'One size may not fit all', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-height--50', 'u-overflow--hidden'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla.',
                    'hasRipple' => false
                ])

                @endcard
            </div>


            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1011',
                    'title' => ['text' => 'Height 25%', 'position' => 'top'],
                    'byline' => ['text' => 'One size may not fit all', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-height--25', 'u-overflow--hidden'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla.',
                    'hasRipple' => false
                ])

                @endcard
            </div>
                
        </div>
    @endutility_doc  
    
</article>
@stop