$(document).ready(function() {
  $('.search-crud-input input').keydown(function(e) {
    if (e.keyCode == 27) { 
      $(this).blur();
    }
  });

  $("input[name='phone']").keydown(function() {
    $(this).val($(this).val().replace(/^(\d{2})(\d{5})(\d)+$/, "($1) $2-$3"));
  });

  $(window).click(function() {
    $("#popup-content").hide();
  });

  $(window).keydown(function(e) {
    if (e.keyCode == 27) { 
      $("#popup-content").hide();
    }
  });

  $(".user-logged-in").on("click", function(e) {
    e.stopPropagation();
    $("#popup-content").fadeToggle(200);
  });
});