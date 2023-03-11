<?php

class CustomerForm
{
  public $fields = array('contact_info' => array(
    'title',
    'honorific',
    'job_title',
    'telephone',
    'mobile',
    'fax',
    'email',
    'msn_skype',
    'facebook_twitter',
  ),
    'company_info' => array(
      'title', 'country',
      'state_province',
      'city',
      'address',
      'core_busines',
      'website',
      'body'
    )
  );

  public function setFormValue(&$form, $node = null)
  {
    if (is_null($node)) {
      return [];
    }
    $companyInfo = null;
    $contactInfo = null;
    $companyInfoId = $node->field_contact_company['und'][0]['target_id'] ?? null;
    if (!is_null($companyInfoId)) {
      $companyInfo = node_load($companyInfoId);
    }
    if ($companyInfo) {
      foreach ($this->fields['company_info'] as $field) {
        if ($field == 'title') {
          $form['company_info_' . $field]['#default_value'] = $companyInfo->title;
        } else if ($field == 'body') {
          $form['company_info_' . $field]['#default_value'] = GlobalHelper::getValueOfNode($companyInfo, 'body');
        } else
          $form['company_info_' . $field]['#default_value'] = GlobalHelper::getValueOfNode($companyInfo, 'field_' . $field);
      }
    }
    $contactInfoId = $node->field_contact_info['und'][0]['target_id'] ?? null;
    if (!is_null($contactInfoId)) {
      $contactInfo = node_load($contactInfoId);
    }
    if ($contactInfo) {
      foreach ($this->fields['contact_info'] as $field) {
        if ($field == "title") {
          $form['contact_info_' . $field]['#default_value'] = $contactInfo->title;
        } else
          $form['contact_info_' . $field]['#default_value'] = GlobalHelper::getValueOfNode($contactInfo, 'field_' . $field);
      }

    }
    return $form;
  }

  public function saveForm($data, $node = null)
  {
    $title = "";
    if (isset($data['contact_info_title'])) {
      $title = $data['contact_info_title'];
    }
    if (is_null($node)) {
      $node = insertNewNode('customer', $title, []);
    }

    $contactInfo = null;
    $contactInfoId = $node->field_contact_info['und'][0]['target_id'] ?? null;
    if (!is_null($contactInfoId)) {
      $contactInfo = node_load($contactInfoId);
    }
    $contactInfoId = $this->saveContactInfo($data, $contactInfo);

    $companyInfo = null;
    $companyInfoId = $node->field_contact_company['und'][0]['target_id'] ?? null;
    if (!is_null($companyInfoId)) {
      $companyInfo = node_load($companyInfoId);
    }
    $companyInfoId = $this->saveCompanyInfo($data, $companyInfo);

    $entity = entity_metadata_wrapper("node", $node);
    $entity->title->set($title);
    $entity->field_contact_info->set($contactInfoId);
    $entity->field_contact_company->set($companyInfoId);
    $entity->save();
    return $entity->getIdentifier();
  }

  public function saveContactInfo($data, $node = null)
  {
    $formData = [];
    foreach ($this->fields['contact_info'] as $field) {
      if (isset($data['contact_info_' . $field])) {
        $formData[$field] = $data['contact_info_' . $field];
      }
    }
    if (is_null($node)) {
      $title = "";
      if (isset($formData['title'])) {
        $title = $formData['title'];
      }
      $node = insertNewNode('contact_info', $title, []);

    }
    $entity = entity_metadata_wrapper("node", $node);
    foreach ($formData as $key => $value) {
      if (isset($node->{'field_' . $key})) {
        if (empty($value)) {
          $value = null;
        }
        $entity->{'field_' . $key}->set($value);
      }else if(isset($node->{$key})){
        $entity->{$key}->set($value);
      }
    }
    $entity->save();
    return $entity->getIdentifier();
  }

  public function saveCompanyInfo($data, $node = null)
  {
    $formData = [];
    foreach ($this->fields['company_info'] as $field) {
      if (isset($data['company_info_' . $field])) {
        $formData[$field] = $data['company_info_' . $field];
      }
    }
    if (is_null($node)) {
      $title = "";
      if (isset($formData['title'])) {
        $title = $formData['title'];
      }
      $node = insertNewNode('company_info', $title, []);
    }
    $entity = entity_metadata_wrapper("node", $node);
    foreach ($formData as $key => $value) {
      if (isset($node->{'field_' . $key})) {
        if (empty($value)) {
          $value = null;
        }
        $entity->{'field_' . $key}->set($value);
      }else if(isset($node->body) && $key == "body"){
        $entity->{$key}->set(array(
          'value' =>$value,
          'format' => 'full_html'));
      }else if(isset($node->{$key})){
        $entity->{$key}->set($value);
      }
    }
    $entity->save();
    return $entity->getIdentifier();
  }

  public function delete($id){
    if($node = node_load($id)){
      $contactInfoId = $node->field_contact_info['und'][0]['target_id'] ?? null;
      if (!is_null($contactInfoId)) {
        $contactInfoNode = node_load($contactInfoId);
        NodeHelper::deleteNode($contactInfoNode);
      }
      $companyInfoId = $node->field_contact_company['und'][0]['target_id'] ?? null;
      if (!is_null($companyInfoId)) {
        $companyInfoNode = node_load($companyInfoId);
        NodeHelper::deleteNode($companyInfoNode);
      }
    }
    return NodeHelper::deleteNode($node);
  }
}
