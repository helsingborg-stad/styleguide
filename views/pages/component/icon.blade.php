@extends('layout.master')

@section('content')
    @markdown
        #Icons
        A variety of icons resides natively in our styleguide. Design to illustrate actions in a simplistic and effortless way.
    @endmarkdown

    @doc(['slug' => 'icon'])

        <div>
        @icon(['icon' => 'close'])
            Icon label will be deprecated
        @endicon
        </div>

        <div>
        @icon(['icon' => 'apps', 'size' => 'lg'])
        @endicon
        </div>

        <div>
        @icon(['icon' => 'bookmark', 'size' => 'xxl', 'color' => 'Primary'])
        @endicon
        </div>

        <div>
            @icon(['icon' => 'add', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'archive', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'keyboard_backspace', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'check', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'cloud_upload', 'size' => 'lg'])
            @endicon
            @icon(['icon' => 'people', 'size' => 'lg'])
            @endicon
        </div>

    @enddoc
@stop
