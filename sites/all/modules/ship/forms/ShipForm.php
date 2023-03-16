<?php

class ShipForm extends BaseForm
{

  public $formId = "ship_form";

  public $nodeType = "ship";

  public $form = array();

  public $fields = array(
    'title',
    'field_vessel_type',
    'field_ship_owner',
    'field_ship_capacity',
  );

  public function beforeLoadForm(){
    parent::beforeLoadForm();
    $this->form = array(
      'title' => array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#default_value' => ""
      ),
      'field_vessel_type' => array(
        '#type' => 'select',
        '#title' => t('Vessel Type'),
        '#options' => TaxonomyHelper::getVesselTypeOptions(),
      ),
      'field_ship_owner' => array(
        '#type' => 'select',
        '#title' => t('Ship Owner'),
        '#options' => NodeHelper::getShipOwnerOptions(),
      ),
      'field_ship_capacity' => array(
        '#type' => 'textfield',
        '#title' => t('Capacity'),
        '#required' => TRUE,
      ),
    );
    return;
  }
}
