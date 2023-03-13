<?php

class ContractForm extends BaseForm
{

  public $formId = "ship_contract_form";

  public $nodeType = "contract";

  public $form = array();

  public $fields = array(
    'title',
    'field_order',
    'field_contract_date',
    'field_contract_duration',
    'field_contract_value',
  );

  public function beforeLoadForm(){
    parent::beforeLoadForm();
    $orderTableOptions = NodeHelper::getOrderTableOptions();
    drupal_add_css(drupal_get_path('module', 'date') . '/date_popup/themes/datepicker.1.7.css');
    drupal_add_js(drupal_get_path('module', 'date') . '/date_popup/date_popup.js');
    $this->form = array(
      'title' => array(
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#required' => TRUE,
        '#default_value' => "",
        '#prefix' => '<style href="'.drupal_get_path('module', 'date') . '/date_popup/date_popup.js'.'"></style>'.
      '',
      ),
      'field_order' => array(
        '#type' => 'tableselect',
        '#title' => t('Ship Order'),
        '#options' => $orderTableOptions['options'],
        '#header' => $orderTableOptions['header'],
        '#attributes' => array('class' => array('table table-sm')),
        '#prefix' => "<label>".t('Ship Order')."</label>",
        '#multiple' => FALSE
      ),
      'field_contract_date' => array(
        '#type' => 'date_popup',
        '#title' => t('Contract Date'),
        '#required' => TRUE,
        '#timepicker' => 'timepicker',
        // New #timepicker_options property handled by the Date Popup Timepicker
        // module and lets to customize timepicker options.
        '#timepicker_options' => array(
          'rows' => 6,
          'minutes' => array(
            'starts' => 0,
            'ends' => 56,
            'interval' => 4,
          ),
          'showCloseButton' => TRUE,
          'closeButtonText' => t('Close'),
        ),
      ),
      'field_contract_duration' => array(
        '#type' => 'textfield',
        '#title' => t('Duration'),
      ),
      'field_contract_value' => array(
        '#type' => 'textfield',
        '#title' => t('Constract Value'),
      ),
    );
    return;
  }
}
