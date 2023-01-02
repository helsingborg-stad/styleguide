@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Text modifications
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'text', 'config' => 'text']])
        @typography([])
            There are many different utility classes to alter text appearance.
        @endtypography
        @typography([
            'classList' => ['u-no-decoration']
        ])
            <b>u-no-decoration</b> removes the text decoration such as underline.
        @endtypography 
        
        @typography([
            'classList' => ['u-inherit-color']
        ])
            <b>u-inherit-color</b> Inherits the text color.
        @endtypography
        
        @typography([
        ])
            <span class="u-bold">u-bold</span> & <span class="u-strong">u-strong</span> both makes the text bold.
        @endtypography
        
        @typography([
            'classList' => ['u-nowrap']
        ])
            <b>u-nowrap</b> makes sure the text always stays on one line and never breaks. Even if going outside of the viewport.
        @endtypography

        @typography([
            'classList' => ['u-truncate']
        ])
            <b>u-truncate</b> is similar to u-nowrap but will truncate instead of overflowing.
        @endtypography
        
        @typography([
            'classList' => ['u-truncate', 'u-truncate-ignore-hover']
        ])
            <b>u-truncate-ignore-hover</b> combined with u-truncate allows overflowing text to be shown on hover.
        @endtypography
        
        @typography([
            'classList' => ['u-text-small']
        ])
            <b>u-text-small</b> makes the text smaller than normal size.
        @endtypography
        
        @typography([
            'classList' => ['u-text-large']
        ])
            <b>u-text-large</b> makes the text larger than normal size.
        @endtypography

        @typography([
            'classList' => ['u-text-xlarge']
        ])
            <b>u-text-xlarge</b> makes the text larger than normal size.
        @endtypography
        
        @typography([
            'classList' => ['u-text-uppercase']
        ])
            <b>u-text-uppercase</b> sets the text to uppercase.
        @endtypography
        
        @typography([
            'classList' => ['u-text-lowercase']
        ])
            <b>u-text-lowercase</b> SETS THE TEXT TO LOWERCASE
        @endtypography
        
        @typography([
            'classList' => ['u-text-capitalize']
        ])
            <b>u-text-capitalize</b> capitalize every word.
        @endtypography
    @endutility_doc
</article>
@stop
