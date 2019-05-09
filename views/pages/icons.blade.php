@extends('layout.master')

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
