@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Headings (Titles etc.)
        A simple heading component. 
    @endmarkdown

    @doc(['slug' => 'heading'])

        @for ($i = 1; $i <= 6; $i++)
            <div>
                @heading([
                    'label' => "Headline level " . $i,
                    'level' => $i
                ])
                @endbutton
            </div>
        @endfor

        @for ($i = 1; $i <= 4; $i++)
            <div>
                @heading([
                    'label' => "Headline level " . $i,
                    'level' => $i
                ])
                @endbutton
                @heading([
                    'label' => "Subheading",
                    'level' => $i+1
                ])
                @endbutton
            </div>
        @endfor

    @enddoc
@stop
