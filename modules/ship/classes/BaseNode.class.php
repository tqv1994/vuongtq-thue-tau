<?php

class BaseNode
{

  protected $title = "";
  protected $viewName = "";
  protected $sizeCreate = "normal";
  protected $sizeUpdate = "normal";
  public string $formClass = BaseNode::class;

  public function edit($id)
  {
    $node = $this->getNodeById($id);
    $formModel = new $this->formClass();
    $form = drupal_get_form($formModel->formId);
    $content = "";
    if (isset($_POST) && count($_POST) > 0) {
      $errors = GlobalHelper::getErrors();
      if (count($errors) > 0) {
        $content .= $this->getValidateErrorHtml($errors);
      } else {
        if ($id = $formModel->saveForm($_POST, $node)) {
          return [
            'forceReload' => $this->viewName,
            'title' => "Sửa $this->title",
            'content' => '<span class="text-success">' . t('Update') . ' ' . $this->title . ' ' . t('success') . '</span>',
            'footer' =>
              "<a data-bs-dismiss='modal' class='btn btn-default'>" . t('Close') . "</a>",
            'size' => 'normal'
          ];
        }

      }
    }
    return [
      "title" => t("Edit") . " " . $this->title,
      "content" => $content . drupal_render($form),
      "footer" => "<button class='btn btn-primary ' type='submit'>".t("Save")."</button>",
      'size' => $this->sizeUpdate,
    ];
  }

  public function create()
  {
    $node = null;
    $formModel = new $this->formClass();
    $form = drupal_get_form($formModel->formId);
    $content = "";
    if (isset($_POST) && count($_POST) > 0) {
      $messages = drupal_get_messages('error');
      if (count($messages['error']) > 0) {
        $errors = [];
        foreach ($messages['error'] as $error) {
          $errors[] = $error;
        }
        $content .= $this->getValidateErrorHtml($errors);
      } else {
        if ($id = $formModel->saveForm($_POST, $node)) {
          return [
            'forceReload' => $this->viewName,
            'title' => "Tạo Mới $this->title",
            'content' => '<span class="text-success">' . t('Create') . ' ' . $this->title . ' ' . t('success') . '</span>',
            'footer' =>
              "<a href='/shipcustomer/create' role='modal-remote' class='btn btn-success '>" . t('Add more') . "</a>",
            'size' => 'normal'
          ];
        }

      }
    }
    return [
      "title" => t("Create") . " " . $this->title,
      "content" => $content . drupal_render($form),
      "footer" => "<button class='btn btn-primary ' type='submit'>".t('Save')."</button>",
      'size' => $this->sizeCreate,
    ];
  }

  public function delete($id)
  {
    if (isset($_POST)) {
      $form = new CustomerForm();
      $form->delete($id);
      return ['forceClose' => true, 'forceReload' => $this->viewName];
    }
  }

  protected function getValidateErrorHtml($errors)
  {
    $output = '<div class="alert alert-danger alert-dismissible p-2" role="alert">';
    foreach ($errors as $error) {
      $output .= "<span>" . $error . "</span><br/>";
    }
    $output .= '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    return $output;
  }

  protected function getNodeById($id)
  {
    return node_load($id);
  }
}
