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
    $content = "";
    if(isset($_POST) && count($_POST) > 0){
      $messages = drupal_get_messages('error');
      if(count($messages['error']) > 0){
        $errors = [];
        foreach ($messages['error'] as $error){
          $errors[] = $error;
        }
        $content .= $this->getValidateErrorHtml($errors);
      }else{
        $id = $formModel->saveForm($_POST, $node);

      }
    }
    return [
      "title" => t("Edit")." ".$this->title,
      "content" => $content.drupal_render($form),
      "footer" => "<button class='btn btn-primary btn-sm' type='submit'>Lưu</button>",
      'size' => 'large',
    ];
  }

  public function create(){
    $node = null;
    $formModel = new CustomerForm();
    $form = drupal_get_form('ship_customer_form');
    $content = "";
    if(isset($_POST) && count($_POST) > 0){
      $messages = drupal_get_messages('error');
      if(count($messages['error']) > 0){
        $errors = [];
        foreach ($messages['error'] as $error){
          $errors[] = $error;
        }
        $content .= $this->getValidateErrorHtml($errors);
      }else{
        $id = $formModel->saveForm($_POST, $node);
      }
    }
    return [
      "title" => t("Create")." ".$this->title,
      "content" => $content.drupal_render($form),
      "footer" => "<button class='btn btn-primary btn-sm' type='submit'>Lưu</button>",
      'size' => 'large',
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
