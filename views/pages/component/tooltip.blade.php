@extends('layout.master')

@section('content')
    @markdown
        #Tooltip
    @endmarkdown

    @doc(['slug' => 'tooltip'])
        @tooltip
            @slot('title')
                Tooltip text
            @endslot

            Hover over me
        @endtooltip
    @enddoc
@stop
