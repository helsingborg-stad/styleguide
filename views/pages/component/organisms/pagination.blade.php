@extends('layout.master')

@section('content')
    @markdown
        #Pagination

        <b>Important notice:</b> The pagination component will not remove pages from the index if it overflows. Please trtuncate your array before sending it into list parameter. 

    @endmarkdown

    @doc(['slug' => 'pagination'])

        @pagination([
            'list' => [
                ['href' => '/component/pagination?pagination=1', 'label' => 'Page 1'],
                ['href' => '/component/pagination?pagination=2', 'label' => 'Page 2'],
                ['href' => '/component/pagination?pagination=3', 'label' => 'Page 3'],
            ],
            'current' => isset($_GET['pagination']) ? $_GET['pagination'] : 1
        ])
        @endpagination

    @enddoc
@stop



