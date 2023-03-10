<?php if(!isset($_GET['id'])): ?>
  <?php include_once __DIR__.'/template/hop-dong/_form_them_hop_dong.php'; ?>
<?php else: ?>
  <?php include_once __DIR__.'/template/hop-dong/_form_hop_dong.php'; ?>
<?php endif; ?>
