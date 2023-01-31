@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Pre-loader
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'pre-loader']])
        @typography([
        ])
            The pre-loader utility can be added to create a loading effect when content is being loaded. Below is two similar boxes where only one is using a the preloader utility.
        @endtypography

        <div style="background-color:blue;width:200px;height:200px;"></div>
        <div class="u-preloader" style="background-color:blue;width:200px;height:200px;"></div>

    @endutility_doc
    
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'opacity']])

        <div class="u-display--flex u-flex--gridgap">
            <div class="u-preloader u-preloader__opacity--1" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--2" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--3" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--4" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--5" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--6" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--7" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--8" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--9" style="background-color:blue;width:200px;height:40px;"></div>
        </div>

    @endutility_doc
    
</article>
@stop
