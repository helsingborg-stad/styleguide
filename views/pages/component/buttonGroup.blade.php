@extends('layout.master')

@section('content')
    @markdown
        #Button group   
    @endmarkdown

    @doc(['slug' => 'buttonGroup'])

        @buttonGroup([
            'href' => '#btn-3', 
            'isOutlined' => true, 
            'text' => 'Button',
            'icon' => 'apps',
            'size' => 'lg',
            'color' => 'secondary'
        ])
        @endbuttonGroup

    @enddoc
@stop



        