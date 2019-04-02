<?php $__env->startSection('content'); ?>
<h1>404 - Page cannot be found</h1>
<p>This page dosen't exists.</p>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php /* /var/www/public/styleguide.local/views/404.blade.php */ ?>