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
}
