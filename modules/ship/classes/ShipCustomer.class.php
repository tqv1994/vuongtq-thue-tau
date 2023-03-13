<?php
class ShipCustomer extends BaseNode {

  protected $viewName = "quan_ly_chu_hang";

  public function __construct()
  {
    $this->formClass = CustomerForm::class;
    $this->title = t("Customer");
    $this->sizeUpdate = "large";
    $this->sizeCreate = "large";
  }
}
