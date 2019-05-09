@extends('layout.master')

@section('content')
    @markdown
        #Icons
        A variety of icons resides natively in our styleguide. Design to illustrate actions in a simplistic and effortless way.
    @endmarkdown

    @doc(['slug' => 'icon'])

        <div>
        @icon(['icon' => 'close'])
            Mutch icon, wow!
        @endicon
        </div>

        <div>
        @icon(['icon' => 'apps', 'size' => 'lg'])
            Here are apps!
        @endicon
        </div>

        <div>
        @icon(['icon' => 'bookmark', 'size' => 'xxl'])
            Bookmark me!
        @endicon
        </div>

        <div>
            @icon(['icon' => 'add', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'archive', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'arrow-back', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'check', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'cloud-upload', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'people', 'size' => 'lg'])
            @endicon
        </div>

    @enddoc
@stop
