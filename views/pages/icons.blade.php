@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'textColor' => 'dark',
        'headline' => 'The icon library', 
        'byline' => 'Material icons', 
    ])

    @slot('content')
        We utilize a icon library provided by the Google Material Design team. The pack has been complemented with our very own icons to siut the needs of a municipality.
    @endslot

    @endhero
@endsection

@section('content')
<article>

    @markdown
        #Icons
        Can be utilized by the component <?php echo "@icon(['icon' => 'home']) @endicon"; ?>. This page represents the complete list of icons avabile. 
    @endmarkdown

    @paper(['padding' => 3])
        @foreach(HbgStyleGuide\Helper\Icons::getJson() as $iconKey => $utf)
            @icon(['icon' => str_replace("icon--", "", $iconKey), 'size' => 'xl'])
            @endicon
        @endforeach
    @endpaper

</article>
@stop
