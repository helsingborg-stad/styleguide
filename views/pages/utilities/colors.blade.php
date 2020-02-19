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

@endutility_doc

@markdown
    ###Background color
@endmarkdown

@utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'colors', 'config' => 'colors__bg']])

    <div class="d-colors">
        <div class="u-color__bg--primary u-display--inline u-rounded u-padding--1">
            <span>Primary</span>
        </div>

        <div class="u-color__bg--secondary u-display--inline u-rounded u-padding--1">
            <span>Secondary</span>
        </div>

        <div class="u-color__bg--danger u-display--inline u-rounded u-padding--1">
            <span>Danger</span>
        </div>

        <div class="u-color__bg--warning u-display--inline u-rounded u-padding--1">
            <span>Warning</span>
        </div>

        <div class="u-color__bg--info u-display--inline u-rounded u-padding--1">
            <span>Info</span>
        </div>

        <div class="u-color__bg--success u-display--inline u-rounded u-padding--1">
            <span>Success</span>
        </div>
    </div>

@endutility_doc
</article>
@stop

