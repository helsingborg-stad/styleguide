<?php $__env->startSection('content'); ?>
<article>
	<h1>Helsingborgs stad - Style guide</h1>

    <p class="lead">Welcome to the online style guide intended for websites within Helsingborgs stad. The guide provides examples, markup and themes for our standardized components.</p>

    <h2>Getting started</h2>
    <p>
        You can easily get started by including our CSS and JavaScript from our GitHub CDN. For the advanced user who wants to customize our code, please refer to the source files in our <a href="https://github.com/helsingborg-stad/styleguide-web" class="link-item">GitHub repository</a>.
    </p>

    <h3>Using GitHub CDN</h3>
    <p>
        Copy and pase this CSS link to the <code>&lt;head&gt;</code> of your document. Chage colorscheme by replaceing "red" in the path to the file. See avabile colorschemes in the selector at the top of the page.
    </p>
    <pre><code class="html">&lt;link rel='stylesheet' id='hbg-prime-css'  href='//helsingborg-stad.github.io/styleguide-web/dist/css/hbg-prime-red.min.css' type='text/css' media='all' /&gt;</code></pre>

    <p>
        Include the JavaScript by copy and pasting the snippet below just before your <code>&lt;/body&gt;</code> closing tag. The file bundles a stable version of jQuery.
    </p>
    <pre><code class="html">&lt;script type='text/javascript' src='//helsingborg-stad.github.io/styleguide-web/dist/js/hbg-prime.min.js' defer='defer'&gt;&lt;/script&gt;</code></pre>
</article>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php /* /var/www/public/styleguide.local/views/home.blade.php */ ?>