<?php
class GlobalHelper{
    public static function getCountryInfoCoreBusinessOptions(){
        return array(
            "Ship Owner"=>"Ship Owner",
            "Ship Operator"=>"Ship Operator",
            "Ship Manager"=>"Ship Manager",
            "Ship Broker"=>"Ship Broker",
            "Ship Supplier"=>"Ship Supplier",
            "Charterer"=>"Charterer",
            "Crew Agency"=>"Crew Agency",
            "Spare Part & Ship Store Supplier"=>"Spare Part & Ship Store Supplier",
            "Forwarding Agent"=>"Forwarding Agent",
            "Shipping Agency"=>"Shipping Agency",
            "Factory & Trading Company"=>"Factory & Trading Company",
            "Ship Repair/Shipyard"=>"Ship Repair/Shipyard",
            "Consultant"=>"Consultant",
            "Financial Institution/Bank/Insurer"=>"Financial Institution/Bank/Insurer",
            "Marine Lawyer"=>"Marine Lawyer",
            "Press"=>"Press",
            "Container Leasing"=>"Container Leasing",
            "Classification Society"=>"Classification Society",
            "Marine Surveyor"=>"Marine Surveyor",
            "P & I Club"=>"P & I Club",
            "Port Authority"=>"Port Authority",
            "Towage/Salvage/Oil Spill Management"=>"Towage/Salvage/Oil Spill Management",
            "University/Maritime College"=>"University/Maritime College",
            "Other Shipping Interest"=>"Other Shipping Interest"
        );
    }

    public static function getValueOfNode($node, $field){
        $value = null;
        if(isset($node->$field['und'][0]['value'])){
            return $node->$field['und'][0]['value'];
        }else if(isset($node->$field['und'][0]['tid'])){
            return $node->$field['und'][0]['tid'];
        }else if(isset($node->$field['und'][0]['target_id'])){
            return $node->$field['und'][0]['target_id'];
        }else{
            return $node->$field;
        }
        return $value;
    }

    public static function getErrors(){
      $messages = drupal_get_messages('error');
      $results = [];
      foreach ($messages['error'] as $message){
        if($message == "Không thể tạo tập tin.") continue;
        $results[] = $message;
      }
      return $results;
    }

    public static function getOrderStatusOptions(){
      return array(
        "pending"=>t("Pending"),
        "in_progress"=>t("In Progress"),
        "shipped"=>t("Shipped"),
        "delivered"=>t("Delivered"),
        "cancelled"=>t("Cancelled"),
        "on_hold"=>t("On hold"),
        "disputed"=>t("Disputed"),
        "complete"=>t("Complete"),
      );
    }
}
