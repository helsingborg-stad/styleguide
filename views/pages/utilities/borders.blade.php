@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Borders
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'borders', 'config' => 'borders']])

        <div class="grid">
            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=743',
                    'title' => ['text' => 'Border around whole element', 'position' => 'top'],
                    'byline' => ['text' => 'Enclose it', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1001',
                    'title' => ['text' => 'Border only in the bottom', 'position' => 'top'],
                    'byline' => ['text' => 'Add as you like', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border__bottom--2'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=10',
                    'title' => ['text' => 'Border removed from right', 'position' => 'top'],
                    'byline' => ['text' => 'Remove as you like', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border', 'u-border__right--0'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
    
            </div>
        </div>
        
    @endutility_doc

    @markdown
        ###Border colors
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'borders', 'config' => 'borders-colors']])
        <div class="grid">
            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1002',
                    'title' => ['text' => 'Border with success color', 'position' => 'top'],
                    'byline' => ['text' => 'Any colour you like', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border', 'u-border__color--success'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1004',
                    'title' => ['text' => 'Border with warning color', 'position' => 'top'],
                    'byline' => ['text' => 'Any colour you like', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border', 'u-border__color--warning'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=1011',
                    'title' => ['text' => 'Border with info color', 'position' => 'top'],
                    'byline' => ['text' => 'Any colour you like', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border', 'u-border__color--info'],
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
