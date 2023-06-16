@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Position
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'position']])
    @endutility_doc

    @markdown
        ###Fixed
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'fixed']])
    @endutility_doc

    @markdown
        ###Absolute
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'absolute']])
    @endutility_doc

    @markdown
        ###Sticky
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'position', 'config' => 'sticky']])
    @endutility_doc

</article>
@stop
