<?php

class BaseForm
{

  public $formId = "";

  public $form = array();

  public $fields = array();

  public function __construct(){
    $this->beforeLoadForm();
  }

  public function beforeLoadForm(){

  }


  public function setFormValue(&$form, $node = null)
  {
    if (is_null($node)) {
      return [];
    }
    foreach ($this->fields as $field) {
      $form[$field]['#default_value'] = GlobalHelper::getValueOfNode($node, $field);
    }
    return $form;
  }

  public function saveForm($data, $node = null)
  {
    $title = "";
    if (isset($data['title'])) {
      $title = $data['title'];
    }
    if (is_null($node)) {
      $node = insertNewNode('ship', $title, []);
    }
    $entity = entity_metadata_wrapper("node", $node);
    foreach ($data as $key => $value) {
      if (isset($node->{$key})) {
        $entity->{$key}->set($value);
      }
    }
    $entity->save();
    return $entity->getIdentifier();
  }



  public function delete($id){
    if($node = node_load($id)){
      return NodeHelper::deleteNode($node);
    }
    return false;
  }
}
