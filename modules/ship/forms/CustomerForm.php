<?php
class CustomerForm{
    public $fields = array('contact_info' => array(
                'title', 
                'honorific',
                'job_title',
                'telephone',
                'mobile',
                'fax',
                'email',
                'msn_skype',
                'facebook_twitter',
            ),
            'company_info' => array(
                'title', 'country',
                'state_province',
                'city',
                'address',
                'core_busines',
                'website',
                'body'
            )
        );

    public function setFormValue(&$form,$node = null){
        if(is_null($node)){
            return [];
        }
        $companyInfo = null;
        $contactInfo = null;
        $companyInfoId = $node->field_contact_company['und'][0]['target_id'] ?? null;
        if(!is_null($companyInfoId)){
            $companyInfo = node_load($companyInfoId);
        }
        if($companyInfo){
            foreach($this->fields['company_info'] as $field){
                if($field == 'title'){
                    $form['company_info_'.$field]['#default_value'] = $companyInfo->title;
                }else if($field == 'body'){
                    $form['company_info_'.$field]['#default_value'] = $companyInfo->body;
                }else
                    $form['company_info_'.$field]['#default_value'] = GlobalHelper::getValueOfNode($companyInfo, 'field_'.$field);
            }
        }
        $contactInfoId = $node->field_contact_info['und'][0]['target_id'] ?? null;
        if(!is_null($contactInfoId)){
            $contactInfo = node_load($contactInfoId);
        }
        if($contactInfo){
            foreach($this->fields['contact_info'] as $field){
                if($field == "title"){
                    $form['contact_info_'.$field]['#default_value'] = $contactInfo->title;
                }else
                    $form['contact_info_'.$field]['#default_value'] = GlobalHelper::getValueOfNode($contactInfo, 'field_'.$field);
            }
        
        }
        return $form;
    }
}