@extends('layout.master')

@section('content')
    {!!
        markdown('
            #Cards

            Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        ')
    !!}

    <div class="markup-preview">
        <div class="grid">
            <div class="grid-md-6">
                {!! component('card') !!}
            </div>
            <div class="grid-md-6">
                {!! component('card') !!}
            </div>
        </div>
    </div>

    <pre><code>
        <div class="grid">
            <div class="grid-md-6">
                {{ component('card') }}
            </div>
            <div class="grid-md-6">
                {{ component('card') }}
            </div>
        </div>
    </code></pre>

    <div class="code-source-file clearfix">
        <div class="pull-left"><strong>Source file:</strong> ~/source/sass/components/card/_card.scss</div>
        <div class="pull-right">
            <a class="link-item link-item-github link-item-outbound" href="https://github.com/helsingborg-stad/styleguide-web/blob/master/source/sass/components/card/_card.scss">View source on GitHub</a>
        </div>
    </div>


@stop
