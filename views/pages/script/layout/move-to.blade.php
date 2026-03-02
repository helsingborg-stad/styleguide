@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Move To
        Move element to new position.
    @endmarkdown
    

    @script_doc(["viewDoc" => ["type" => "script", "root" => "moveto", "config" => "moveto"]])

        @markdown
            By defining data attribute `data-move-to` on an element and assigning a value being a selector to another element, the element will be moved to the position of the other element and be added as a child to this element.
        @endmarkdown

        @markdown
            Example:
            ```html
                <div id="target"></div><!-- The element below will end up as a child of this element -->
                <div data-move-to="#target"></div>
            ```
        @endmarkdown

    @endscript_doc
@stop
