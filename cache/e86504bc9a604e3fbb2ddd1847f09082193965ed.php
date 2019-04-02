<nav>
    <ul class="nav-aside">
        <?php $__currentLoopData = $nav; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item => $subitems): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li class="">
                <a href="/<?php echo e($item); ?>"><?php echo e(\HbgStyleGuide\Navigation::readableFilename($item)); ?></a>
                <?php if(is_array($subitems) && !empty($subitems)): ?>
                    <ul class="sub-menu" style="display: block;">
                        <?php $__currentLoopData = $subitems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $subitem): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <li><a href="/<?php echo e($item); ?>/<?php echo e($subitem); ?>"><?php echo e(\HbgStyleGuide\Navigation::readableFilename($subitem)); ?></a></li>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                <?php endif; ?>
            </li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ul>
</nav>
