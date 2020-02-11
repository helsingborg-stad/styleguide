@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Display
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'display', 'config' => 'display']])
        <div class="u-display--inline-block u-color__bg--info">u-display--inline-block</div>
        <div class="u-display--inline-block u-color__bg--success">u-display--inline-block</div>

        <div class="u-display--block u-color__bg--success">u-display--block</div>
        <div class="u-display--block u-color__bg--info">u-display--block</div>
    @endutility_doc

</article>
@stop
