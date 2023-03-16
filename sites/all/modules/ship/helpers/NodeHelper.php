<?php
class NodeHelper{
  public static function deleteNode($node){
    $entity = entity_metadata_wrapper('node',$node);
    $id = $entity->getIdentifier() ?? false;
    if($id){
      entity_delete('node', $id);
    }
    return $id;
  }

  public static function getShipOwnerOptions(){
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'ship_owner')
      ->propertyOrderBy('created', 'DESC');
    $result = $query->execute();
    $options = array();
    foreach ($result['node'] as $item) {
      $node = node_load($item->nid);
      $label = $node->title ?? "";
      if($companyInfoId = GlobalHelper::getValueOfNode($node, "field_company_info_ship_owner")){
        if($companyNode = node_load($companyInfoId)){
          $label = $companyNode->title;
        }
      }
      $options[$item->nid] = $label;
    }
    return $options;
  }

  public static function getShipOptions(){
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'ship')
      ->propertyOrderBy('created', 'DESC');
    $result = $query->execute();
    $options = array();
    foreach ($result['node'] as $item) {
      $node = node_load($item->nid);
      $label = $node->title ?? "";
      if($shipOwnerId = GlobalHelper::getValueOfNode($node, "field_ship_owner")){
        if($shipOwner = node_load($shipOwnerId)){
          if($companyInfoId = GlobalHelper::getValueOfNode($shipOwner, "field_company_info_ship_owner")){
            if($companyNode = node_load($companyInfoId)){
              $label = $label." - ".$companyNode->title;
            }
          }
        }
      }
      $options[$item->nid] = $label;
    }
    return $options;
  }

  public static function getCustomerOptions(){
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'customer')
      ->propertyOrderBy('created', 'DESC');
    $result = $query->execute();
    $options = array();
    foreach ($result['node'] as $item) {
      $node = node_load($item->nid);
      $label = $node->title ?? "";
      if($companyInfoId = GlobalHelper::getValueOfNode($node, "field_contact_company")){
        if($companyNode = node_load($companyInfoId)){
          $label = $companyNode->title;
        }
      }
      $options[$item->nid] = $label;
    }
    return $options;
  }

  public static function getOrderTableOptions(){
    $options = array();
    $header = array(
      'title' => array('data' => t('Order ID'), 'field' => 'n.title'),
      'field_ship' => t('Ship'),
      'field_customer' => t('Customer'),
      'field_cargo_type' => t("Cargo Type"),
      'field_cargo_weight' => t("Cargo Weight"),
      'field_loading_port' => t("Loading Port"),
      'field_discharging_port' => t("Discharging Port"),
      'field_status' => t("Status"),
      'changed' => array('data' => t('Updated'), 'field' => 'n.changed', 'sort' => 'desc')
    );
    $query = db_select('node','n')->extend('PagerDefault')->extend('TableSort');
    $nids = $query
      ->fields('n',array('nid'))
      ->condition('n.status', 1)
      ->condition('n.type', 'order')
      ->limit(50)
      ->orderByHeader($header)
      ->execute()
      ->fetchCol();
    $nodes = node_load_multiple($nids);
    foreach ($nodes as $node) {
      $shipNode = self::getObjectNode(GlobalHelper::getValueOfNode($node, "field_ship")) ?? null;
      $customerNode = self::getObjectNode(GlobalHelper::getValueOfNode($node, "field_customer")) ?? null;
      $companyCustomerNode = self::getObjectNode(GlobalHelper::getValueOfNode($customerNode, "company_contact")) ?? null;
      $options[$node->nid] = array(
        'title' => array(
          'data' => array(
            '#type' => 'link',
            '#title' => $node->title,
            '#href' => 'node/' . $node->nid,
          ),
        ),
        'field_ship' => $shipNode->title ?? "",
        'field_customer' => $companyCustomerNode->title ?? "",
        'field_cargo_type' => TaxonomyHelper::getTermNameById(GlobalHelper::getValueOfNode($node, 'field_cargo_type')) ?? "",
        "field_cargo_weight" => GlobalHelper::getValueOfNode($node, 'field_cargo_weight') ?? "",
        "field_loading_port" => GlobalHelper::getValueOfNode($node, 'field_loading_port') ?? "",
        "field_discharging_port" => GlobalHelper::getValueOfNode($node, 'field_discharging_port') ?? "",
        "field_status" => GlobalHelper::getValueOfNode($node, 'field_status') ?? "",
        'changed' => format_date($node->changed, 'short'),
      );
    }



    return array(
      'header' => $header,
      'options' => $options
    );
  }

  public static function getObjectNode($nodeId){
    if(is_null($nodeId) || empty($nodeId)){
      return null;
    }
    return node_load($nodeId);
  }
}
