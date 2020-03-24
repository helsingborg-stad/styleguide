@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Visibility
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'visibility', 'config' => 'visibility']])

        <div style="text-align: center;">
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
                'element' => 'h4',
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
