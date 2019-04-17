@extends('layout.master')

@section('content')
    @markdown
        #Icons
        A variety of icons resides natively in our styleguide. Design to illustrate actions in a simplistic and effortless way.
    @endmarkdown

    @doc(['slug' => 'icon'])

        @icon(['icon' => 'home'])
            Mutch icon, wow!
        @endicon

        @icon(['icon' => 'caret-left'])
            Mutch left pointing icon, wow!
        @endicon

        @icon(['icon' => 'plus'])
            Mutch icon plus, wow!
        @endicon

    @enddoc
@stop
