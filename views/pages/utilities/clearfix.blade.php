@extends('layout.master')

@section('content')
<article>

    @markdown
        #Clearfix
    @endmarkdown
    @utility_doc(['slug' => 'clearfix', 'page_config' => 'true'])
        <div style="background-color: brown" class="u-clearfix">
            @button([
                'href' => '#btn-3', 
                'isOutlined' => false, 
                'isPrimary' => true,
                'classList' => ['float-left']
            ])
            Float Left
            @endbutton

            @button([
                'href' => '#btn-3',
                'isOutlined' => false,
                'isPrimary' => false,
                'isCircle' => true,
                'classList' => ['float-right']
            ])
            Float Right
            @endbutton
        </div>
    @endutility_doc

</article>
@stop
