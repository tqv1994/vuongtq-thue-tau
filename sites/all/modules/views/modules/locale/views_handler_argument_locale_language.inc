<?php

/**
 * @file
 * Contains .
 */

/**
 * Argument handler to accept a language.
 *
 * @ingroup views_argument_handlers
 */
#[\AllowDynamicProperties]
class views_handler_argument_locale_language extends views_handler_argument {

  /**
   * {@inheritdoc}
   */
  public function construct() {
    parent::construct('language');
  }

  /**
   * Override the behavior of summary_name(). Get the user friendly version
   * of the language.
   */
  public function summary_name($data) {
    return $this->locale_language($data->{$this->name_alias});
  }

  /**
   * Override the behavior of title(). Get the user friendly version
   * of the language.
   */
  public function title() {
    return $this->locale_language($this->argument);
  }

  /**
   * {@inheritdoc}
   */
  public function locale_language($langcode) {
    $languages = views_language_list();
    return isset($languages[$langcode]) ? $languages[$langcode] : t('Unknown language');
  }

}
