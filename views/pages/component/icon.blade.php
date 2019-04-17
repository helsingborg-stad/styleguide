@extends('layout.master')

@section('content')
    @markdown
        #Icons
        A variety of icons resides natively in our styleguide. Design to illustrate actions in a simplistic and effortless way.
    @endmarkdown

    @doc(['slug' => 'icon'])

        <div>
        @icon(['icon' => 'home'])
            Mutch icon, wow!
        @endicon
        </div>

        <div>
        @icon(['icon' => 'close-o'])
        @endicon
        </div>

        <div>
        @icon(['icon' => 'plus'])
            Mutch icon plus, wow!
        @endicon
        </div>

    @enddoc
@stop
