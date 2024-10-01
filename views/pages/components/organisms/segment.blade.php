@extends('layout.containers.doc')

@section('doc-content')
    {!!
        markdown('
            #Segments (sections)

            The sections componet are specifically build to contain other components. The component creates a full-page container with a layout. It will work as long as the current container is centered. The component automatically bleeds beyond the container.
        ')
    !!}

    @doc(['slug' => 'segment'])
    @enddoc
@endsection