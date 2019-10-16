@extends('layout.master')

@section('content')
<article>

    @markdown
        #Position
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'position']])
        @button([
            'href' => '#btn-1', 
            'isOutlined' => true, 
            'isPrimary' => false,
            'classList' => ['u-disabled']
        ])
            Disabled Button
        @endbutton
    @endutility_doc

    @markdown
        ###Fixed
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'fixed']])
        @button([
            'href' => '#btn-1', 
            'isOutlined' => true, 
            'isPrimary' => false,
            'classList' => ['u-disabled']
        ])
            Disabled Button
        @endbutton
    @endutility_doc

    @markdown
        ###Sticky
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'sticky']])
        @button([
            'href' => '#btn-1', 
            'isOutlined' => true, 
            'isPrimary' => false,
            'classList' => ['u-disabled']
        ])
            Disabled Button
        @endbutton
    @endutility_doc

</article>
@stop
