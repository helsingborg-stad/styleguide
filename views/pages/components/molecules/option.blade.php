@extends('layout.containers.doc')

@section('doc-content')
    @doc(['slug' => 'option'])
        @form([
        ])
        <div class="grid">
            <div class="grid-md-6">

                @markdown
                    ##Checkboxes
                    Simple but still nice looking checkboxes.
                    Styled with CSS for a nicer appearance.
                @endmarkdown

                

            </div>
            <div class="grid-md-6">

                @markdown
                    ##Radio buttons
                    Or why not Radio buttons that also went through a makeover.
                @endmarkdown

               
            </div>
        </div>
        @endform
    @enddoc
@endsection