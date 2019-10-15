@extends('layout.master')

@section('content')
<article>

    @markdown
        #Borders
    @endmarkdown
    @utility_doc(['slug' => 'borders', 'utilitySlug' => "Borders"])

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
                'classList' => ['u-border--bottom--2']
                ])
    
                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Border removed from right',    
                'classList' => ['u-border--2 u-border--right--0']
                ])
    
                @endcard
    
            </div>
        </div>
        
    @endutility_doc

    @markdown
        ###Border colors
    @endmarkdown
    @utility_doc(['slug' => 'borders', 'utilitySlug' => "Borders-colors"])
        <div class="grid">
            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Success color',
                'classList' => ['u-border u-border--success']
                ])
    
                @endcard
    
            </div>
    
            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Warning color',    
                'classList' => ['u-border u-border--warning']
                ])
    
                @endcard
    
            </div>

            <div class="grid-s-12 grid-md-4">
                @card([
                'href' => 'http://styleguide.helsingborg.se/card',
                'image' => 'https://picsum.photos/300/200?image=1077',
                'title' => 'Info color',    
                'classList' => ['u-border u-border--info']
                ])
    
                @endcard
    
            </div>
        </div>
        
    @endutility_doc

</article>
@stop
