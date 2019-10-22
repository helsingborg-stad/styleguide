@extends("layout.master")

@section("content")
    @markdown
        #Toggle
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "toggle", "config" => "toggle"]])
        
        <div js-toggle-container>
            <button js-toggle-trigger>Toggle</button>
            <div js-toggle-multi="u-color__bg--success">
                <div class="">Test</div>
                <div class="test">Test</div>
            </div>
        </div>
        
    @endscript_doc
@stop
