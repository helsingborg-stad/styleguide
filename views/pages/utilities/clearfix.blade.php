@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Clearfix
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'clearfix', 'config' => 'clearfix']])
        @typography([])
            When floating items it can cause the container to loose it's height. To slove this we add the class <code>u-clearfix</code> which gives the container it's original height back.
        @endtypography

        <div class="u-clearfix u-color__bg--primary u-rounded u-padding">
            @button([
                'href' => '#btn-3', 
                'isOutlined' => false,
                'isPrimary' => true,
                'classList' => ['u-float--left']
            ])
            Float Left
            @endbutton

            @button([
                'href' => '#btn-3',
                'isOutlined' => false,
                'isPrimary' => false,
                'isCircle' => true,
                'classList' => ['u-float--right']
            ])
            Float Right
            @endbutton
        </div>
    @endutility_doc

</article>
@stop
