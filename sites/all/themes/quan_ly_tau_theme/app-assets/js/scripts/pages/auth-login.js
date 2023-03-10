/*=========================================================================================
  File Name: auth-login.js
  Description: Auth login js file.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: PIXINVENT
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
  'use strict';

  var pageLoginForm = $('.auth-login-form');

  // jQuery Validation
  // --------------------------------------------------------------------
  if (pageLoginForm.length) {
    pageLoginForm.validate({
      /*
      * ? To enable validation onkeyup
      onkeyup: function (element) {
        $(element).valid();
      },*/
      /*
      * ? To enable validation on focusout
      onfocusout: function (element) {
        $(element).valid();
      }, */
      rules: {
        'login-email': {
          required: true,
          // email: true
        },
        'login-password': {
          required: true
        }
      }
    });
  }

  $(document).on('click', '#btn-dang-nhap', function (e){
    e.preventDefault();
    var $username = $("#login-email").val(),
      $paw = $("#login-password").val();
    $("#edit-name").val($username);
    $("#edit-pass").val($paw);
    $("#user-login").submit();
  })
});
