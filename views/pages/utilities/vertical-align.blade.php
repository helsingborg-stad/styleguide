@extends('layout.master')

@section('content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['slug' => 'vertical-align', 'page_config' => true])
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
    @endutility_doc

    @markdown
        <h3>Vertical alignments</h3>
    @endmarkdown
    @utility_doc(['slug' => 'vertical-align2', 'page_config' => true])
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
    @endutility_doc

    

</article>
@stop
