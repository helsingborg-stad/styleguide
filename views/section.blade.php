
<h2 id="{{ \HbgStyleGuide\Helper\FormatString::slug($section[0]->name) }}" class="underline text-highlight">{{ $section[0]->name }}</h2>

@if ($section[0]->description)
<section>
    <article>
        {!! $section[0]->description !!}
    </article>
</section>
@endif

@if (isset($section[0]->state))
<section class="states">
    <h3>Modifiers</h3>
    <ul>
    @foreach ((array)$section[0]->state as $state)
        <li>
            <code>{{ $state->name }}</code> - {!! $state->description !!}
        </li>
    @endforeach
    </ul>
</section>
@endif

@if (isset($section[0]->markup[0]))
<section class="example example-{{ \HbgStyleGuide\Helper\FormatString::slug($section[0]->name) }}">
    <h3>Example</h3>
    <div class="markup-preview">
        {!! trim($section[0]->markup[0]->example) !!}
    </div>

    <pre><code class="html">{{ trim($section[0]->markup[0]->escaped) }}</code></pre>

    <div class="code-source-file clearfix">
        <div class="pull-left"><strong>Source file:</strong> {{ $section[0]->markup[0]->path }}</div>
        <div class="pull-right">
            <a class="link-item link-item-github" href="https://github.com/helsingborg-stad/styleguide-web/blob/master/{{ str_replace('~/', '', $section[0]->markup[0]->path) }}">View source on GitHub</a>
        </div>
    </div>
</section>
@endif
