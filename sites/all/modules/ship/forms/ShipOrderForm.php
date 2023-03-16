<?php

class ShipOrderForm extends BaseForm
{

  public $formId = "ship_order_form";

  public $nodeType = "order";

  public $form = array();

  public $fields = array(
    'title',
    'field_customer',
    'field_ship',
    'field_cargo_type',
    'field_cargo_weight',
    'field_loading_port',
    'field_discharging_port',
    'field_status'
  );

  public function beforeLoadForm(){
    parent::beforeLoadForm();
    $this->form = array(
      'title' => array(
        '#type' => 'textfield',
        '#title' => t('Order ID'),
        '#required' => TRUE,
        '#default_value' => ""
      ),
      'field_customer' => array(
        '#type' => 'select',
        '#title' => t('Customer'),
        '#options' => NodeHelper::getCustomerOptions(),
      ),
      'field_ship' => array(
        '#type' => 'select',
        '#title' => t('Ship'),
        '#options' => NodeHelper::getShipOptions(),
      ),
      'field_cargo_type' => array(
        '#type' => 'select',
        '#title' => t('Cargo Type'),
        '#required' => TRUE,
        '#options' => TaxonomyHelper::getItemsOptions(),
      ),
      'field_cargo_weight' => array(
        '#type' => 'textfield',
        '#title' => t('Cargo Weight'),
        '#required' => TRUE,
      ),
      'field_loading_port' => array(
        '#type' => 'textfield',
        '#title' => t('Loading Port'),
        '#required' => TRUE,
      ),
      'field_discharging_port' => array(
        '#type' => 'textfield',
        '#title' => t('Discharging Port'),
        '#required' => TRUE,
      ),
      'field_status' => array(
        '#type' => 'select',
        '#title' => t('Status'),
        '#required' => TRUE,
        '#options' => GlobalHelper::getOrderStatusOptions(),
      ),
    );
    $group = $this->fields;
    foreach ($group as $k => $item){
      $this->form[$item]['#prefix'] = '';
      if($k % 2 == 0){
        $this->form[$item]['#prefix'] .= "<div class='row'><div class='col-md-6 col-xs-12'>";
        $this->form[$item]['#suffix'] = "</div>";
        if(!isset($group[$k + 1])){
          $this->form[$item]['#suffix'] .= "</div>";
        }
      }else{
        $this->form[$item]['#prefix'] .= "<div class='col-md-6 col-xs-12'>";
        $this->form[$item]['#suffix'] = "</div></div>";
      }
    }
    return;
  }
}
