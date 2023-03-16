<?php
class TaxonomyHelper{
    public static function getCountriesOptions(){
        $vocabulary = taxonomy_vocabulary_machine_name_load('countries');

        // Get an array of term objects for the terms in the 'countries' vocabulary.
        $terms = taxonomy_get_tree($vocabulary->vid);

        // Create an array of options for the 'country' select field.
        $options = array();
        foreach ($terms as $term) {
            $options[$term->tid] = $term->name;
        }
        return $options;
    }

    public static function getVesselTypeOptions(){
        $vocabulary = taxonomy_vocabulary_machine_name_load('vessel_type');

        // Get an array of term objects for the terms in the 'countries' vocabulary.
        $terms = taxonomy_get_tree($vocabulary->vid);

        // Create an array of options for the 'country' select field.
        $options = array();
        foreach ($terms as $term) {
            $options[$term->tid] = $term->name;
        }
        return $options;
    }

  public static function getItemsOptions(){
    $vocabulary = taxonomy_vocabulary_machine_name_load('items');

    // Get an array of term objects for the terms in the 'countries' vocabulary.
    $terms = taxonomy_get_tree($vocabulary->vid);

    // Create an array of options for the 'country' select field.
    $options = array();
    foreach ($terms as $term) {
      $options[$term->tid] = $term->name;
    }
    return $options;
  }

  public static function getTermNameById($id){
    $term = taxonomy_term_load($id);
    if ($term) {
      $vocabulary = taxonomy_vocabulary_load($term->vid);
      return $term->name;
    }
    return "";
  }
}
