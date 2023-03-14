<?php $pathUrl = "/shipdispute/"; ?>
<div class="card">
  <h5 class="card-header">
    <?php print t('Dispute Manager') ?>
  </h5>
  <div class="card-body">
    <table class="table table-bordered table-responsive table-striped table-hover">
      <?php if (!empty($title) || !empty($caption)): ?>
        <caption><?php print $caption . $title; ?></caption>
      <?php endif; ?>
      <div class="action-header mb-2">
        <a href="<?php print $pathUrl ?>create" class="btn btn-success " role="modal-remote"><i class="fa fa-plus"></i> <?php print t('Create') ?></a>
      </div>
      <?php if (!empty($header)) : ?>
        <thead>
        <tr>
          <?php foreach ($header as $field => $label): ?>
            <?php if($field == 'nid') continue; ?>
            <th <?php if ($header_classes[$field]): ?> class="<?php print $header_classes[$field]; ?>"<?php endif; ?> scope="col">
              <?php print $label; ?>
            </th>
          <?php endforeach; ?>
          <th></th>
        </tr>
        </thead>
      <?php endif; ?>
      <tbody>
      <?php foreach ($rows as $row_count => $row): ?>
        <tr <?php if ($row_classes[$row_count]): ?> class="<?php print implode(' ', $row_classes[$row_count]); ?>"<?php endif; ?>>
          <?php foreach ($row as $field => $content): ?>
            <?php if($field == 'nid') continue; ?>
            <td <?php if ($field_classes[$field][$row_count]): ?> class="<?php print $field_classes[$field][$row_count]; ?>"<?php endif; ?><?php print drupal_attributes($field_attributes[$field][$row_count]); ?>>
              <?php print $content; ?>
            </td>
          <?php endforeach; ?>
          <?php if(isset($row['nid'])): ?>
            <td class="text-center">
              <a class="btn btn-sm  btn-warning" role="modal-remote" href="<?php print $pathUrl ?>edit/?id=<?php echo $row['nid'] ?>">
                <i class="fa  fa-pencil"></i>
              </a>
              <a data-pjax="0" role="modal-remote" data-request-method="post" href="<?php print $pathUrl ?>delete/<?php echo $row['nid'] ?>"
                 data-toggle="tooltip" data-confirm-title="<?php print t("Warning") ?>"
                 data-confirm-message="<?php print t("Are you sure you want to delete?") ?>" data-original-title="<?php print t("Delete") ?>" class="btn btn-sm btn-danger">
                <i class="fa fa-trash"></i>
              </a>
            </td>
          <?php endif; ?>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>

  </div>
</div>
