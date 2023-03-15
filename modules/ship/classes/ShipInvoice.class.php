<?php
class ShipInvoice extends BaseNode {

  protected $title = "";

  protected $viewName = "quan_ly_hoa_don";

  public function __construct()
  {
    $this->title = t("Invoice");
    $this->formClass = InvoiceForm::class;
    $this->sizeUpdate = "large";
    $this->sizeCreate = "large";
  }

}
