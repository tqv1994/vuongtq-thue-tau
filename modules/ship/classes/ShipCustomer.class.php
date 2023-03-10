<?php
class ShipCustomer {

  protected $title = "";

  public function __construct()
  {
    $this->title = t("Customer");
  }

  public function index(){

  }

  public function edit(){

    $form = drupal_get_form('ship_customer_form');
    $content = "";
    if(isset($_POST)){
      $messages = drupal_get_messages('error');
      if(!empty($messages['error'])){
        $errors = [];
        foreach ($messages['error'] as $error){
          $errors[] = $error;
        }
        $content .= $this->getValidateErrorHtml($errors);
      }

    }
    return [
      "title" => t("Edit")." ".$this->title,
      "content" => $content.drupal_render($form),
      "footer" => "<button class='btn btn-primary btn-sm' type='submit'>Lưu</button>",
      'size' => 'large',
      'form_errors' => $form_errors
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
}
