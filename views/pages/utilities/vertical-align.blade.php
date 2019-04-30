@extends('layout.master')

@section('content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown
    @doc()
        @table([
            'list' => [
                ['u-align-baseline ', 'Align according to baseline'],
                ['u-align-middle', 'Align middle'],
                ['u-align-bottom', 'Align with the bottom'],
                ['u-align-text-bottom', 'Align with the bottom of current row'],
                ['u-align-text-top', 'Align with the top of current row'],
            ],
            'headings' => ['Class', 'Description'],
            'showFooter' => false
        ])
        @endtable
    @enddoc

</article>
@stop
