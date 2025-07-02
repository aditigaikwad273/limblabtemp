//= require active_admin/base
//= require admin/select2

$(document).ready(function() {
  $('form.formtastic .select select:not(.ajax)').select2({
    width: '80%',
    selectOnClose: true
  });

  $('form.formtastic .date_select select').select2({
    width: '100%',
    selectOnClose: true
  });
  
  $('.sidebar_section .filter_select select').select2({
    width: '240px',
    selectOnClose: true
  });  
});

$(document).on('has_many_add:after', '.has_many_container', function(e, fieldset, container) {
  fieldset.find('.select select:not(.ajax)').select2({
    width: '80%',
    selectOnClose: true
  });
});
