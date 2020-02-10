@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Breadcrumb
        Used to indicate where the user is in the structure of a page. 
    @endmarkdown

    @doc(['slug' => 'breadcrumb'])

        @breadcrumb([
                'list' => [
                    ['href' => 'https://google.se', 'label' => 'Main page'],
                    ['href' => 'https://google.se', 'label' => 'Sub page'],
                    ['href' => 'https://google.se', 'label' => 'Sub sub page'],
                ]
            ])
        @endbreadcrumb

    @enddoc
@stop
