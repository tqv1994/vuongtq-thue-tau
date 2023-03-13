<?php

class ShipOwnerForm extends BaseForm
{

  public $formId = "ship_owner_form";
  public $form = array();

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

  public function beforeLoadForm(){
    $this->form = array(
      'contact_info_title' => array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#default_value' => ""
      ),
      'contact_info_honorific' => array(
        '#type' => 'select',
        '#title' => t('Honorific'),
        '#options' => array(
          'Mr.' => 'Mr.',
          'Ms.' => 'Ms.',
          'Mrs.' => 'Mrs.',
          'Captain' => 'Captain'
        ),
        '#default_value' => "Mr.",
      ),
      'contact_info_job_title' => array(
          '#type' => 'textfield',
          '#title' => t('Job Title'),
      ),
      'contact_info_telephone' => array(
        '#type' => 'textfield',
        '#title' => t('Telephone'),
        '#required' => TRUE,
      ),
      'contact_info_mobile' => array(
        '#type' => 'textfield',
        '#title' => t('Mobile'),
      ),
      'contact_info_fax' => array(
        '#type' => 'textfield',
        '#title' => t('Fax'),
      ),
      'contact_info_email' => array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#required' => TRUE,
      ),
      'contact_info_msn_skype' => array(
        '#type' => 'textfield',
        '#title' => t('MSN/Skype'),
      ),
      'contact_info_facebook_twitter' => array(
        '#type' => 'textfield',
        '#title' => t('Facebook/Twitter'),
      ),
      'company_info_title' => array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
      ),
      'company_info_country' => array(
        '#type' => 'select',
        '#title' => t('Country'),
        '#options' => TaxonomyHelper::getCountriesOptions(),
        '#required' => TRUE,
      ),
      'company_info_state_province' => array(
        '#type' => 'textfield',
        '#title' => t('State/Province'),
        '#required' => TRUE,
      ),
      'company_info_city' => array(
        '#type' => 'textfield',
        '#title' => t('City'),
        '#required' => TRUE,
      ),
      'company_info_address' => array(
        '#type' => 'textfield',
        '#title' => t('Address'),
      ),
      'company_info_core_busines' => array(
        '#type' => 'select',
        '#title' => t('Core Business'),
        '#options' => GlobalHelper::getCountryInfoCoreBusinessOptions(),
        '#required' => TRUE,
      ),
      'company_info_website' => array(
        '#type' => 'textfield',
        '#title' => t('Website'),
      ),
      'company_info_body' => array(
        '#type' => 'textarea',
        '#title' => t('Company Profile'),
      )
    );
    $group = $this->fields;
    foreach ($group['contact_info'] as $k => $item){
      $this->form['contact_info_'.$item]['#prefix'] = '';
      if($k == 0){
        $this->form['contact_info_'.$item]['#prefix'] .= "<h4>".t('Contact Info')."</h4>";
      }
      if($k % 2 == 0){
        $this->form['contact_info_'.$item]['#prefix'] .= "<div class='row'><div class='col-md-6 col-xs-12'>";
        $this->form['contact_info_'.$item]['#suffix'] = "</div>";
        if(!isset($group['contact_info'][$k + 1])){
          $this->form['contact_info_'.$item]['#suffix'] .= "</div>";
        }
      }else{
        $this->form['contact_info_'.$item]['#prefix'] .= "<div class='col-md-6 col-xs-12'>";
        $this->form['contact_info_'.$item]['#suffix'] = "</div></div>";
      }
    }

    foreach ($group['company_info'] as $k => $item){
      $this->form['company_info_'.$item]['#prefix'] = '';
      if($k == 0){
        $this->form['company_info_'.$item]['#prefix'] .= "<hr/><h4>".t('Company Info')."</h4>";
      }
      if($k % 2 == 0){
        $this->form['company_info_'.$item]['#prefix'] .= "<div class='row'><div class='col-md-6 col-xs-12'>";
        $this->form['company_info_'.$item]['#suffix'] = "</div>";
        if(!isset($group['contact_info'][$k + 1])){
          $this->form['company_info_'.$item]['#suffix'] .= "</div>";
        }
      }else{
        $this->form['company_info_'.$item]['#prefix'] .= "<div class='col-md-6 col-xs-12'>";
        $this->form['company_info_'.$item]['#suffix'] = "</div></div>";
      }
    }
    return;
  }


  public function setFormValue(&$form, $node = null)
  {
    if (is_null($node)) {
      return [];
    }
    $companyInfo = null;
    $contactInfo = null;
    $companyInfoId = $node->field_company_info_ship_owner['und'][0]['target_id'] ?? null;
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
    $contactInfoId = $node->field_contact_info_ship_owner['und'][0]['target_id'] ?? null;
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
      $node = insertNewNode('ship_owner', $title, []);
    }

    $contactInfo = null;
    $contactInfoId = $node->field_contact_info_ship_owner['und'][0]['target_id'] ?? null;
    if (!is_null($contactInfoId)) {
      $contactInfo = node_load($contactInfoId);
    }
    $contactInfoId = $this->saveContactInfo($data, $contactInfo);

    $companyInfo = null;
    $companyInfoId = $node->field_company_info_ship_owner['und'][0]['target_id'] ?? null;
    if (!is_null($companyInfoId)) {
      $companyInfo = node_load($companyInfoId);
    }
    $companyInfoId = $this->saveCompanyInfo($data, $companyInfo);

    $entity = entity_metadata_wrapper("node", $node);
    $entity->title->set($title);
    $entity->field_contact_info_ship_owner->set($contactInfoId);
    $entity->field_company_info_ship_owner->set($companyInfoId);
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
