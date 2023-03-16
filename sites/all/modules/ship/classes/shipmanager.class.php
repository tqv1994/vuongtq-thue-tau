<?php

class ShipManager {
  public function index(){
    print "Hello, this is my Prometheus class front page";
  }

  public function hello($input){
    return array('message' => "Hello: $input");
  }

  public function category($category1, $category2){
    print("Categories are $category1, $category2");
  }

  public function show_my_list(){
    print "my list";
  }

  public function my_contact_list(){
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node');
    $query->entityCondition('bundle', 'customer');
    $result = $query->execute();
    var_dump($result);
//    $phone_list = db_select('phone_list', 'phone_id')
//      ->fields('phone_id')
//      ->condition('type', 'work_phone', '=')
//      ->execute()
//      ->fetchAll();
//    $address_list = db_select('address_list', 'address_id')
//      ->fields('address_id')
//      ->condition('zipcode', '12345', '=')
//      ->execute()
//      ->fetchAll();
//    return array('phone_list' => $phone_list, 'address_list' => $address_list);
  }
}
