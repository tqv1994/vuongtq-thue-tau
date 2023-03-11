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
}