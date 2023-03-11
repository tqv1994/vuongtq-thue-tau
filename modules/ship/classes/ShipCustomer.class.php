<?php
class ShipCustomer {

  protected $title = "";

  public function __construct()
  {
    $this->title = t("Customer");
  }

  public function index(){

  }

  public function edit($id){
    $node = $this->getNodeById($id);
    $formModel = new CustomerForm();
    $form = drupal_get_form('ship_customer_form');
    $companyInfo = null;
        $contactInfo = null;
        $companyInfoId = $node->field_contact_company['und'][0]['target_id'] ?? null;
        if(!is_null($companyInfoId)){
            $companyInfo = node_load($companyInfoId);
        }
    $content = "";
    if(isset($_POST)){
      $messages = drupal_get_messages('error');
      if(!empty($messages['error'])){
        $errors = [];
        foreach ($messages['error'] as $error){
          $errors[] = $error;
        }
        $content .= $this->getValidateErrorHtml($errors);
      }else{

      }
    }
    return [
      "title" => t("Edit")." ".$this->title,
      "content" => $content.drupal_render($form),
      "footer" => "<button class='btn btn-primary btn-sm' type='submit'>Lưu</button>",
      'size' => 'large',
      'node' => $companyInfo,
    ];
  }

  protected function getValidateErrorHtml($errors){
    $output = '<div class="alert alert-danger alert-dismissible p-2" role="alert">';
    foreach ($errors as $error){
      $output .= "<span>".$error."</span><br/>";
    }
    $output .= '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    return $output;
  }

  protected function getNodeById($id ){
    return node_load($id);
  }
}
