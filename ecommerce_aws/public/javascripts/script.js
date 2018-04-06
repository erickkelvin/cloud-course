$(document).ready(function() {
  $('.search-crud-input input').on('click focus', function() {
    $(this).addClass('active');
    $(this).keyup(function(e) {
      if (e.keyCode == 27) { 
        $(this).blur();
     }
    });
  });

  $('.search-crud-input input').focusout(function() {
    $(this).removeClass('active');
    $(this).val('');
  });

  $("input[name='phone']").keyup(function() {
    $(this).val($(this).val().replace(/^(\d{2})(\d{5})(\d)+$/, "($1) $2-$3"));
  });
});