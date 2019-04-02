<nav>
    <ul class="nav-aside">
        <?php $__currentLoopData = $nav; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item => $subitems): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li class="<?php echo e(($subitems) ? 'has-children' : ''); ?> <?php echo e(($pageNow == $item) ? 'current' : ''); ?>">
                <a href="/<?php echo e($item); ?>"><?php echo e(ucwords($item)); ?></a>
                <?php if($pageNow == $item && $subitems): ?>
                    <ul class="sub-menu">
                    <?php $__currentLoopData = $subitems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $subitem): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <li><a href="#<?php echo e(\HbgStyleGuide\Helper\FormatString::slug($subitem)); ?>"><?php echo e(ucwords($subitem)); ?></a></li>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                <?php endif; ?>
            </li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ul>
</nav>

<?php /* /var/www/public/styleguide.local/views/layout/navigation.blade.php */ ?>