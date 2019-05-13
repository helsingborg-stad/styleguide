@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'textColor' => 'dark',
        'headline' => 'Css utilities', 
        'byline' => '.u-do-something', 
    ])

    @slot('content')
        SWiftly create new apperance of anything in the styleguide, or even create a new component. Each utility has their corresponding mixin.
    @endslot

    @endhero
@endsection

@section('content')
<article>

    @markdown
        #Utilities
        List of css utilities. 
    @endmarkdown

</article>
@stop
