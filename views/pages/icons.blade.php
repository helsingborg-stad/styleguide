@extends('layout.master')

@section('content')
<article>

    @markdown
        #Icons
        Can beutilirzed by the component <?php echo "@icon(['icon' => 'home']) @endicon"; ?>. This page represents the complete list of icons avabile. 
    @endmarkdown

    @table([
            'list' => [
                ['A', 'B', 'C', 'D'],
                ['A', 'B', 'C', 'D'],
                ['A', 'B', 'C', 'D'],
                ['A', 'B', 'C', 'D']
            ],
            'headings' => ['Icon', 'Class', 'Tag', 'Component'],
            'showFooter' => true
        ])
        @endtable
        
</article>
@stop
