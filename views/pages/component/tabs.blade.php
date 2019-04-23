@extends('layout.master')

@section('content')
    @markdown
        # Tabs
    @endmarkdown

    @doc(['slug' => 'tabs'])
        @tabs(['tabs' => array(
            array(
                'title' => 'Tab one',
                'content' => 'Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor.'
            ),
            array(
                'title' => 'Tab two',
                'content' => 'Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit tempus porttitor.'
            ),
        )])
        @endtabs
    @enddoc
@stop
