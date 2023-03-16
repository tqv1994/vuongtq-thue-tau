<?php
class ShipOrder extends BaseNode {

  protected $title = "";

  protected $viewName = "quan_ly_don_hang";

  public function __construct()
  {
    $this->title = t("Ship Order");
    $this->formClass = ShipOrderForm::class;
    $this->sizeUpdate = "large";
    $this->sizeCreate = "large";
  }

}
