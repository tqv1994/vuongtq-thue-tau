<?php
class ShipOwner extends BaseNode {

  protected $title = "";

  protected $viewName = "quan_ly_chu_tau";

  public function __construct()
  {
    $this->title = t("Ship Owner");
    $this->formClass = ShipOwnerForm::class;
    $this->sizeUpdate = "large";
    $this->sizeCreate = "large";
  }

}
