<?php
class ShipCustomer {

  protected $title = "";
  protected $viewName = "quan_ly_chu_hang";

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
        if($id = $formModel->saveForm($_POST, $node)){
          return [
            'forceReload' => $this->viewName,
            'title' => "Sửa $this->title",
            'content' => '<span class="text-success">'.t('Update').' ' . $this->title . ' '.t('success').'</span>',
            'footer' =>
              "<a data-bs-dismiss='modal' class='btn btn-default'>".t('Close')."</a>",
          ];
        }

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
        if($id = $formModel->saveForm($_POST, $node)){
          return [
            'forceReload' => $this->viewName,
            'title' => "Tạo Mới $this->title",
            'content' => '<span class="text-success">'.t('Create').' ' . $this->title . ' '.t('success').'</span>',
            'footer' =>
              "<a href='/shipcustomer/create' role='modal-remote' class='btn btn-success btn-sm'>".t('Add more')."</a>",
          ];
        }

      }
    }
    return [
      "title" => t("Create")." ".$this->title,
      "content" => $content.drupal_render($form),
      "footer" => "<button class='btn btn-primary btn-sm' type='submit'>Lưu</button>",
      'size' => 'large',
    ];
  }

  public function delete($id){
    if(isset($_POST)){
      $form = new CustomerForm();
      $form->delete($id);
      return ['forceClose' => true, 'forceReload' => $this->viewName];
    }
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
