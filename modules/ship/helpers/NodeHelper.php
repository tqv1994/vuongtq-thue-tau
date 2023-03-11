<?php
class NodeHelper{
  public static function deleteNode($node){
    $entity = entity_metadata_wrapper('node',$node);
    $entity->field_active->set(0);
    $entity->save();
    return $entity->getIdentifier();
  }
}
