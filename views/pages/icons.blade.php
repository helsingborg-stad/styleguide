@extends('layout.master')

@section('content')
<article>

    @markdown
        #Icons
        Can beutilirzed by the component <?php echo "@icon(['icon' => 'home']) @endicon"; ?>. This page represents the complete list of icons avabile. 
    @endmarkdown

    @foreach(HbgStyleGuide\Helper\Icons::getJson() as $iconKey => $utf)
        @icon(['icon' => str_replace("icon--", "", $iconKey), 'size' => 'xl'])
        @endicon
    @endforeach

</article>
@stop
