<?php $__env->startSection('content'); ?>
    <h1>404 - Page cannot be found</h1>
    <p>This page dosen't exists.</p>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout.master', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>