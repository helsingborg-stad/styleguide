@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Sections

            The sections componet are specifically build to contain other components. The component creates a full-page container with a layout. It will work as long as the current container is centered. The component automatically bleeds beyond the container.
        ')
    !!}

@endsection

@section('hero')

    <style>
        
    </style>
    <div class="container">
        <section class="c-section c-section--wide c-section-padding-md">
            <div class="">
                Hello
            </div>
        </section>
    </div>


    <div class="container">
        <section class="c-section c-section--full">
            <div class="">
                Hello
            </div>
        </section>
    </div>

@stop
