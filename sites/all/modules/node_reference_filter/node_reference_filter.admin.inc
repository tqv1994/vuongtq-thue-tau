<?php
/**
 * @file
 * Administration functios for node_reference_filter module.
 */

/**
 * Form constructor for admin of nodereference fields.
 *
 * @ingroup forms
 */
function node_reference_filter_node_type_form($state) {
  // Get all fields that are defined as nodereference autocomplete.
  $sql = 'SELECT i.field_name, i.data, n.name, n.type, c.data AS gdata FROM {field_config_instance} AS i
    JOIN {field_config} AS c ON i.field_name = c.field_name JOIN {node_type} AS n ON i.bundle = n.type
    WHERE c.type = \'entityreference\' ORDER BY i.field_name, n.name ASC';
  $fields = db_query($sql);
  $tbl_rows = array();
  while ($field = $fields->fetchObject()) {
    $data = unserialize($field->data);
    $gdata = unserialize($field->gdata);
    if ($data['widget']['type'] == 'entityreference_autocomplete' && $gdata['settings']['target_type'] == 'node') {
      $tbl_rows[] = array(
        $field->field_name . ' (' . $data['label'] . ')',
        $field->name,
        l(t('edit'), 'admin/config/content/nodereference_settings/edit/' . $field->type . '/' . $field->field_name),
        l(t('reset to default'), 'admin/config/content/nodereference_settings/reset/' . $field->type . '/' . $field->field_name),
      );
    }
  }
  // Create table element in form.
  $variables = array(
    'header' => array(
      'Field',
      'Content type',
      array(
        'data' => 'Action',
        'colspan' => 2,
      ),
    ),
    'rows' => $tbl_rows,
  );
  $table = theme('table', $variables);
  $form['table'] = array(
    '#markup' => $table,
  );
  return $form;
}

/**
 * Form constructor for admin of nodereference fields settings.
 *
 * @see node_reference_filter_field_settings_form_validate()
 * @see node_reference_filter_field_settings_form_validate()
 * @ingroup forms
 */
function node_reference_filter_field_settings_form($state) {
  $form = array();
  // Get parameters from url.
  $type = arg(5);
  $field = arg(6);
  // Get field instance record.
  $result = db_query('SELECT * FROM {field_config_instance} WHERE field_name = :field AND bundle = :type', array(':field' => $field, ':type' => $type));
  $instance = $result->fetchObject();
  if (empty($instance)) {
    drupal_set_message(t('Could not find field - @type : @field', array('@type' => $type, '@field' => $field)));
    return $form;
  }
  $result = db_query('SELECT * FROM {node_type} WHERE type = :type', array(':type' => $type));
  $node_type = $result->fetchObject();
  $settings = unserialize($instance->data);
  // Get global settings.
  $result = db_query('SELECT * FROM {field_config} WHERE field_name = :field', array(':field' => $field));
  $global = $result->fetchObject();
  $global_settings = unserialize($global->data);
  // Get filter settings.
  $filter_settings = variable_get('nrf_' . $type . '_' . $field, array('apply_filter' => 0, 'filter_types' => array()));
  // Build form.
  $form['field'] = array(
    '#type' => 'fieldset',
    '#title' => check_plain($node_type->name . ' - ' . $settings['label']),
  );
  $form['field']['apply_filter'] = array(
    '#type' => 'radios',
    '#title' => check_plain('Apply filter'),
    '#options' => array('Disabled', 'Enabled'),
    '#default_value' => $filter_settings['apply_filter'],
    '#description' => check_plain('Set if this filter should run for the nodereference autocomplete field ' . $settings['label'] . ' in node type ' . $node_type->name),
  );
  $options = array();
  foreach ($global_settings['settings']['handler_settings']['target_bundles'] as $t) {
    if (!empty($t)) {
      $result = db_query('SELECT name FROM {node_type} WHERE type = :type', array(':type' => $t));
      $name = $result->fetchObject();
      $options[$t] = $name->name;
    }
  }
  $form['field']['types'] = array(
    '#type' => 'checkboxes',
    '#title' => check_plain('Node types'),
    '#options' => $options,
    '#default_value' => ((!empty($filter_settings['filter_types'])) ? $filter_settings['filter_types'] : array_keys($options)),
    '#description' => check_plain('Set the node types to filter by for the nodereference autocomplete field ' . $settings['label'] . ' in node type ' . $node_type->name),
  );
  $form['field']['buttons']['save'] = array(
    '#type' => 'submit',
    '#value' => 'Save',
  );
  $form['field']['buttons']['back'] = array(
    '#type' => 'submit',
    '#value' => 'Back',
    '#submit' => array('node_reference_filter_back_to_field_list'),
  );
  return $form;
}

/**
 * Back to nodereference field list form.
 */
function node_reference_filter_back_to_field_list($form, &$state) {
  drupal_goto('admin/config/content/nodereference_settings');
}

/**
 * Form validation handler for node_reference_filter_field_settings_form().
 *
 * @see node_reference_filter_field_settings_form_submit()
 */
function node_reference_filter_field_settings_form_validate($form, &$state) {
  // No need to validate if back button or not enabled.
  if ($state['values']['op'] == 'Back' || empty($state['values']['apply_filter'])) {
    return;
  }
  $not_selected = TRUE;
  foreach ($state['values']['types'] as $t) {
    if (!empty($t)) {
      $not_selected = FALSE;
      break;
    }
  }
  if ($not_selected) {
    form_set_error('types', 'At least 1 node type must be selected.');
  }
}

/**
 * Form submission handler for node_reference_filter_field_settings_form().
 *
 * @see node_reference_filter_field_settings_form_validate()
 */
function node_reference_filter_field_settings_form_submit($form, &$state) {
  // Get parameters from url.
  $type = arg(5);
  $field = arg(6);
  // Set filter settings.
  $settings = array('apply_filter' => $state['values']['apply_filter'], 'filter_types' => array());
  foreach ($state['values']['types'] as $t) {
    if (!empty($t)) {
      $settings['filter_types'][] = $t;
    }
  }
  // Save settings.
  variable_set('nrf_' . $type . '_' . $field, $settings);
  // Redirect.
  drupal_set_message(t('Field filter settings saved - @field in @type', array('@field' => $field, '@type' => $type)));
  drupal_goto('admin/config/content/nodereference_settings');
}

/**
 * Reset field settings to default drupal nodereference settings.
 */
function node_reference_filter_reset_field_settings() {
  // Get parameters from url.
  $type = arg(5);
  $field = arg(6);
  // Delete settings.
  variable_del('nrf_' . $type . '_' . $field);
  // Redirect.
  drupal_set_message(t('Field filter settings reset - @field in @type', array('@field' => $field, '@type' => $type)));
  drupal_goto('admin/config/content/nodereference_settings');
}
