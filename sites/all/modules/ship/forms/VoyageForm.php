<?php

class VoyageForm extends BaseForm
{

  public $formId = "ship_voyage_form";

  public $nodeType = "voyage";

  public $form = array();

  public $fields = array(
    'title',
    'field_order_voyage',
    'field_ship_voyage',
    'field_location',
    'field_voyage_start_date',
    'field_voyage_status'
  );

  public function beforeLoadForm(){
    parent::beforeLoadForm();
    $orderTableOptions = NodeHelper::getOrderTableOptions();
//    drupal_add_css(drupal_get_path('module', 'date') . '/date_popup/themes/datepicker.1.7.css');
//    drupal_add_js(drupal_get_path('module', 'date') . '/date_popup/date_popup.js');
    $this->form = array(
      'title' => array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#default_value' => "",
      ),
      'field_order_voyage' => array(
        '#type' => 'tableselect',
        '#title' => t('Ship Order'),
        '#options' => $orderTableOptions['options'],
        '#header' => $orderTableOptions['header'],
        '#attributes' => array('class' => array('table table-sm')),
        '#prefix' => "<label>".t('Ship Order')."</label>",
        '#multiple' => FALSE
      ),
      'field_ship_voyage' => array(
        '#type' => 'textfield',
        '#title' => t('Ship'),
        '#required' => TRUE,
      ),
      'field_location' => array(
        '#type' => 'textfield',
        '#title' => t('Location'),
        '#required' => TRUE,
      ),
      'field_voyage_start_date' => array(
        '#type' => 'textfield',
        '#title' => t('Date'),
        '#required' => TRUE,
        '#attributes' => array(
          'class' =>array("flatpickr-date"),
          'placeholder' => "DD/MM/YYYY"
        ),
      ),
      'field_voyage_status' => array(
        '#type' => 'textfield',
        '#title' => t('Status'),
      ),
    );
    return;
  }
}
