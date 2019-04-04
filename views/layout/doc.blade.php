<?php
    
?>
<section id="docblock-{{rand(0,99999)}}" class="example">
    <h3>Example</h3>
    <div class="markup-preview">
        {!! $markup !!}
    </div>
    <pre><code>{{ \HbgStyleGuide\Helper\ParseString::tidyHtml($markup)}}</code></pre>
</section>