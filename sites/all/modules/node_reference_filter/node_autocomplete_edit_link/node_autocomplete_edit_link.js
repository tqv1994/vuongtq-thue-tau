jQuery(document).ready(function() {
  jQuery("input.form-autocomplete[type=text]").each(function (){
    var value = jQuery(this).val();
    if(value != "" && /\([0-9]+\)$/.test(value)){
      var matches = value.match(/\([0-9]+\)$/);
      var match = matches[0];
      var nid = match.replace(/[^0-9]+/g, "");
      var span = '<a href="/node/'+nid+'/edit" class="form-autocomplete-edit" target="_blank">edit node</a>';
      jQuery(span).insertAfter(jQuery(this));
      var div = '<div style="clear:both;"></div>';
      jQuery(div).insertAfter(jQuery(this).parent());
    }
  });
});
