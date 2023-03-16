<?php
class Ship extends BaseNode {

  protected $viewName = "ship";


  public function __construct()
  {
    $this->formClass = ShipForm::class;
    $this->title = t("Ship");
  }
}
