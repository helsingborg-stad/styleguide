@extends('layout.master')

@section('content')
<article>

    @markdown
        #Borders
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'borders', 'config' => 'borders']])

        <div class="grid">
            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border around whole element',
                'classList' => ['u-border']
                ])
    
                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border only in bottom of element',    
                'classList' => ['u-border__bottom--2']
                ])
    
                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border removed from right',    
                'classList' => ['u-border--2 u-border__right--0']
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
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Success color',
                'classList' => ['u-border u-border__color--success']
                ])
    
                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Warning color',    
                'classList' => ['u-border u-border__color--warning']
                ])
    
                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Info color',    
                'classList' => ['u-border u-border__color--info']
                ])
    
                @endcard
    
            </div>
        </div>
        
    @endutility_doc

</article>
@stop
