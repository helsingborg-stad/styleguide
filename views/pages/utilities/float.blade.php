@extends('layout.master')

@section('content')
<article>

    @markdown
        #Float
    @endmarkdown

    @utility_doc(['slug' => 'float', 'utilitySlug' => "float"])
        <div>
            @button([
                    'href' => '#btn-1', 
                    'isOutlined' => true, 
                    'isPrimary' => false,
                    'classList' => ['u-float--right']
                ])
                    Button one
                @endbutton

                @button([
                    'href' => '#btn-2', 
                    'isOutlined' => true, 
                    'isPrimary' => true,
                    'classList' => ['u-float--right']
                ])
                    Button two
                @endbutton

                @button([
                    'href' => '#btn-3', 
                    'isOutlined' => false, 
                    'isPrimary' => true,
                    'classList' => ['u-float--right']
                ])
                Button three
                @endbutton

                @button([
                    'href' => '#btn-3',
                    'isOutlined' => false,
                    'isPrimary' => false,
                    'isCircle' => true,
                    'classList' => ['u-float--right']
                ])
                Button four
            @endbutton
        </div>
    @endutility_doc


    

</article>
@stop
