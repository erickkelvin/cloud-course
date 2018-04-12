$(document).ready(function() {
  $('.search-crud-input input').keydown(function(e) {
    if (e.keyCode == 27) { 
      $(this).blur();
    }
  });

  $("input[name='phone']").keydown(function() {
    $(this).val($(this).val().replace(/^(\d{2})(\d{5})(\d)+$/, "($1) $2-$3"));
  });

  $(".crud-form #photo-container #photo-button").click(function() {
    $("input#photo_url").val("");
    $("#users-form #photo-container img").attr("src","/images/default-user.png");
    $("#products-form #photo-container img").attr("src","/images/default-product.png");
    $(this).removeClass("active");
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

  $(".login-message").fadeIn(100);

  setTimeout(() => $(".login-message").fadeOut(500), 3000);

});