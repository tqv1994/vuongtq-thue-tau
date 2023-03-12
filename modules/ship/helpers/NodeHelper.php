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
}
