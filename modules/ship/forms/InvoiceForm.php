<?php

class InvoiceForm extends BaseForm
{

  public $formId = "ship_invoice_form";

  public $nodeType = "invoice";

  public $form = array();

  public $fields = array(
    'title',
    'field_invoice_order',
    'field_invoice_date',
    'field_invoice_amount',
    'field_invoice_status',
  );

  public function beforeLoadForm(){
    parent::beforeLoadForm();
    $orderTableOptions = NodeHelper::getOrderTableOptions();
//    drupal_add_css(drupal_get_path('module', 'date') . '/date_popup/themes/datepicker.1.7.css');
//    drupal_add_js(drupal_get_path('module', 'date') . '/date_popup/date_popup.js');
    $this->form = array(
      'title' => array(
        '#type' => 'textfield',
        '#title' => t('Invoice ID'),
        '#required' => TRUE,
        '#default_value' => "",
      ),
      'field_invoice_order' => array(
        '#type' => 'tableselect',
        '#title' => t('Ship Order'),
        '#options' => $orderTableOptions['options'],
        '#header' => $orderTableOptions['header'],
        '#attributes' => array('class' => array('table table-sm')),
        '#prefix' => "<label>".t('Ship Order')."</label>",
        '#multiple' => FALSE
      ),
      'field_invoice_date' => array(
        '#type' => 'textfield',
        '#title' => t('Invoice Date'),
        '#required' => TRUE,
        '#attributes' => array(
          'class' =>array("flatpickr-date"),
          'placeholder' => "DD/MM/YYYY"
        ),
      ),
      'field_invoice_amount' => array(
        '#type' => 'textfield',
        '#title' => t('Invoice Amount'),
      ),
      'field_invoice_status' => array(
        '#type' => 'textfield',
        '#title' => t('Status'),
      ),
    );
    return;
  }
}
