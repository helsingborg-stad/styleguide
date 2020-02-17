@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Display
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'display', 'config' => 'display']])

    @typography([
        'variant' => 'headline',
        'classList' => [
            'u-color__text--primary',
            'u-margin__bottom--0',
        ]
    ])
        Inline Block
    @endtypography

    @typography([])
        Displaying inline-block allows the element to stack side to side.
    @endtypography

    <div class="u-color__bg--primary u-padding--2 u-rounded">
        <div class="u-display--inline-block u-rounded u-padding--1 u-color__bg--info">u-display--inline-block</div>
        <div class="u-display--inline-block u-rounded u-padding--1 u-color__bg--success">u-display--inline-block</div>
    </div>

    @typography([
        'variant' => 'headline',
        'classList' => [
            'u-color__text--primary',
            'u-margin__bottom--0',
            'u-margin__top--2'
        ]
    ])
        Block
    @endtypography

    @typography([])
        Displaying block makes the elements take up full with which results in them stacking on top of eachother.
    @endtypography

    <div class="u-color__bg--primary u-padding--2 u-rounded">
        <div class="u-display--block u-rounded u-padding--1 u-color__bg--info">u-display--block</div>
        <div class="u-display--block u-rounded u-padding--1 u-color__bg--success">u-display--block</div>
    </div>
    @endutility_doc

</article>
@stop
