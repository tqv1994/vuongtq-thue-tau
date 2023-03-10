<?php
/**
 * @var $phone_list[]
 * @var $address_list[]
 */
?>
test
<table id="table">
  <?php foreach ($phone_list as $phone): ?>
    <tr>
      <td><?=$phone['zone_code']?> - <?=$phone['number']?></td>
    </tr>
  <?php endforeach; ?>
</table>

<ul>
  <?php foreach ($address_list as $address): ?>
  <li><?php print $address['text']?></li>
  <?php endforeach; ?>
</ul>
