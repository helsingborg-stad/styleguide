@extends('layout.containers.doc')

@section('doc-content')
<article>

@markdown
    ###Text color
@endmarkdown

@utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'colors', 'config' => 'colors__text']])
    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--primary']
    ])
        Primary Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--secondary']
    ])
        Secondary Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--danger']
    ])
    Danger Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--info']
    ])
        Info Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--success']
    ])
        Success Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--warning']
    ])
        Warning Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--light', 'u-color__bg--info']
    ])
        Light Text
    @endtypography

    @typography([
        'element' => 'h6',
        'variant' => 'h4',
        'classList' => ['u-color__text--dark']
    ])
        Dark Text
    @endtypography

@endutility_doc

@markdown
    ###Background color
@endmarkdown

@utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'colors', 'config' => 'colors__bg']])

    @grid([
        "container" => true,
        "columns" => "auto-fit",
        //"min_width" => "100px",
        "max_width" => "100px",
        "col_gap" => "3"
    ])
        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--default u-rounded" style="height: 20px;"></div>
            <span>Default</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--primary u-rounded" style="height: 20px;"></div>
            <span>Primary</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--secondary u-rounded" style="height: 20px;"></div>
            <span>Secondary</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--danger u-rounded" style="height: 20px;"></div>
            <span>Danger</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--warning u-rounded" style="height: 20px;"></div>
            <span>Warning</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--info u-rounded" style="height: 20px;"></div>
            <span>Info</span>
        @endgrid

        @grid(['classList' => ['u-text-align--center']])
            <div class="u-color__bg--success u-rounded" style="height: 20px;"></div>
            <span>Success</span>
        @endgrid
    @endgrid

@endutility_doc
</article>
@stop

