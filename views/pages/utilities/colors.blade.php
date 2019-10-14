@extends('layout.master')

@section('content')
<article>

@markdown
    ###Text color
@endmarkdown

@utility_doc(['slug' => 'colors', 'utilitySlug' => "colors__text"])
    @table([
        'list' => [
            ['u-align-baseline ', 'Align according to baseline'],
            ['u-align-middle', 'Align middle'],
            ['u-align-bottom', 'Align with the bottom'],
            ['u-align-text-bottom', 'Align with the bottom of current row'],
            ['u-align-text-top', 'Align with the top of current row'],
        ],
        'headings' => ['Class', 'Description'],
        'showFooter' => false,
        'classList' => ['u-color__text--danger']
    ])
    @endtable
@endutility_doc

@markdown
    ###Background color
@endmarkdown
@utility_doc(['slug' => 'colors', 'utilitySlug' => "colors__bg"])
    @table([
        'list' => [
            ['u-align-baseline ', 'Align according to baseline'],
            ['u-align-middle', 'Align middle'],
            ['u-align-bottom', 'Align with the bottom'],
            ['u-align-text-bottom', 'Align with the bottom of current row'],
            ['u-align-text-top', 'Align with the top of current row'],
        ],
        'headings' => ['Class', 'Description'],
        'showFooter' => false,
        'classList' => ['u-color__bg--success']
    ])
    @endtable
    @endutility_doc

    

</article>
@stop

