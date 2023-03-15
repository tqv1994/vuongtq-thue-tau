<?php
class ShipVoyage extends BaseNode {

  protected $title = "";

  protected $viewName = "quan_ly_khai_thac";

  public function __construct()
  {
    $this->title = t("Voyage");
    $this->formClass = VoyageForm::class;
    $this->sizeUpdate = "large";
    $this->sizeCreate = "large";
  }

}
