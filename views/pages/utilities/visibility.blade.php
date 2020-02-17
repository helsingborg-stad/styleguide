@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Visibility
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'visibility', 'config' => 'visibility']])

        <div class="u-display--flex">
            @button([
                'href' => '#btn-3',
                'isOutlined' => false,
                'isPrimary' => false,
                'isCircle' => true,
                'attributeList' => [
                    'js-toggle-trigger' => 'example',
                ]
            ])
                Toggle u-visibility--hidden
            @endbutton

            @typography([
                'element' => 'p',
                'variant' => 'subtitle',
                'attributeList' => [
                    'js-toggle-item' => 'example',
                    'js-toggle-class' => 'u-visibility--hidden'
                ]
            ])
            Now you see me!
            @endtypography
        </div>
        
    @endutility_doc

</article>
@stop
