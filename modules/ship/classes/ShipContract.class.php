<?php
class ShipContract extends BaseNode {

  protected $title = "";

  protected $viewName = "quan_ly_hop_dong";

  public function __construct()
  {
    $this->title = t("Contract");
    $this->formClass = ContractForm::class;
    $this->sizeUpdate = "normal";
    $this->sizeCreate = "normal";
  }

}
