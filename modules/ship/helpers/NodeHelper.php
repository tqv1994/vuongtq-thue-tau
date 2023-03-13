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
}
