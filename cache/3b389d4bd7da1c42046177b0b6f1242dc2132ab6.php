
<h2 id="<?php echo e(\HbgStyleGuide\Helper\FormatString::slug($section[0]->name)); ?>" class="underline text-highlight"><?php echo e($section[0]->name); ?></h2>

<?php if($section[0]->description): ?>
<section>
    <article>
        <?php echo $section[0]->description; ?>

    </article>
</section>
<?php endif; ?>

<?php if(isset($section[0]->state)): ?>
<section class="states">
    <h3>Modifiers</h3>
    <ul>
    <?php $__currentLoopData = (array)$section[0]->state; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $state): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <li>
            <code><?php echo e($state->name); ?></code> - <?php echo $state->description; ?>

        </li>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ul>
</section>
<?php endif; ?>

<?php if(isset($section[0]->markup[0])): ?>
<section class="example example-<?php echo e(\HbgStyleGuide\Helper\FormatString::slug($section[0]->name)); ?>">
    <h3>Example</h3>
    <div class="markup-preview">
        <?php echo trim($section[0]->markup[0]->example); ?>

    </div>

    <pre><code class="html"><?php echo e(trim($section[0]->markup[0]->escaped)); ?></code></pre>

    <div class="code-source-file clearfix">
        <div class="pull-left"><strong>Source file:</strong> <?php echo e($section[0]->markup[0]->path); ?></div>
        <div class="pull-right">
            <a class="link-item link-item-github" href="https://github.com/helsingborg-stad/styleguide-web/blob/master/<?php echo e(str_replace('~/', '', $section[0]->markup[0]->path)); ?>">View source on GitHub</a>
        </div>
    </div>
</section>
<?php endif; ?>
