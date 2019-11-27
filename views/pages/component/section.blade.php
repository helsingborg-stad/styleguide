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
        .c-section {
            display: block; 
            background: #eee; 
        }

        .c-section-full, 
        .c-section-wide {
            max-width: 100vw;
            width: 100vw;
        }

        .c-section--full {
            margin: 32px calc(50% - 50vw);
        }

        .c-section--wide {
            margin: 32px calc(25% - 25vw);
        }
    </style>
    <div class="container">
        <section class="c-section c-section--wide">
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
