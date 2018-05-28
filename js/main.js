$(document).ready(function() {

  var click_menu = false;
  var $menuItems = $("#main_menu ul li a"),
  lastId = 'Inicio',
  id,
  cur,
  fromTop,
  fired = 0,
  scrollItems = $menuItems.map(function() {
    var item = $($(this).attr("href"));
    if (item.length) return item;
  });
  // add current menu class "current"
  $(window).bind('scroll', scrolling);

  function scrolling(){
    $(window).scroll(function(){
      //with scroll determines when the current class need to change
      fromTop = $(this).scrollTop() + 100;

      cur = scrollItems.map( function() {
        if ($(this).offset().top < fromTop) return this;
      });

      // Get the id of the current element
      cur = cur[cur.length-1];
      id = cur && cur.length ? cur[0].id : "";
      if (lastId !== id) {
        lastId = id;
        fired = 0
        if (fired === 0){
          activateMenuElement(id);
        }
      }else{
        fired = 1;
      }
    });
  }

  /* Create magic line menu */
  $("#main_menu ul.group").append("<li id='magic-line'></li>");
  var $magicLine = $("#magic-line");
  $magicLine.width($('.current-menu-item').width()).css("left", $('.current-menu-item a').position().left).data("origLeft", $magicLine.position().left).data("origWidth", $magicLine.width());

  /* addClases and move line from menu */
  function activateMenuElement(name) {
    $('#main_menu').find('.current').removeClass('current');
    $('#main_menu').find('[data-menuanchor="' + name + '"]').addClass('current');
    $('#main_menu').find('.current-menu-item').removeClass('current-menu-item');
    $('#main_menu').find('[id="' + name + '_anchor"]').addClass('current-menu-item');

    $('nav#fp-nav').find('.active').removeClass('active');
    $('nav#fp-nav').find('[id="' + name + '_anchor_right"]').addClass('active');
    moveLine();
    fired = 1;
  }

  /* Scroll to sections when click menu */
  $('#main_menu ul li a, .mobile-menu li a').on('click', function(e){
    $(window).unbind('scroll');
    var section = $(this).attr('data-menuanchor');
    activateMenuElement(section);
    $('html,body').stop().animate({
      scrollTop: $('#'+section).offset().top - 99
    }, 1000, function(){
      $(window).bind('scroll', scrolling);
    });
  });

  /* Scroll to sections when click right menu */
  $('nav#fp-nav ul li a').on('click', function(e){
    $(window).unbind('scroll');
    var section = $(this).attr('href').substring(1);
    activateMenuElement(section);
    $('html,body').stop().animate({
      scrollTop: $('#'+section).offset().top - 99
    }, 1000, function(){
      $(window).bind('scroll', scrolling);
    });
  });

  $('.anchor_text').on('click', function(e){
    e.preventDefault();
    var seccion = $(this).attr('href');
    $('html,body').stop().animate({
      scrollTop: $(seccion).offset().top - 99
    }, 1000);
  });

  /* Move line on active menu link */
  function moveLine(){
    var $magicLine = jQuery("#magic-line");
    var leftPos, newWidth;
    leftPos = jQuery(".current-menu-item a").position().left;
    newWidth = jQuery(".current-menu-item").width();
    $magicLine.stop().animate({
      left: leftPos,
      width: newWidth
    });
  }



  /*Menu derecha*/
  $('nav#fp-nav ul li a').on('click', function(){
    $('nav#fp-nav ul li a').removeClass('active');
    $(this).addClass('active');
  });

  /* Menu hamburguesa */
  document.querySelector(".hamburguer").addEventListener("click", function(){
    //document.querySelector(".full-menu").classList.toggle("active");
    document.querySelector(".hamburguer").classList.toggle("close-hamburguer");
    $('.mobile-menu').slideToggle('slow');
  });

  $('.mobile-menu li a').on('click', function(){
    document.querySelector(".hamburguer").classList.toggle("close-hamburguer");
    $('.mobile-menu').slideToggle('slow');
  });

  $('#map_contacto').click(function() {
    if ($(".tooltip").hasClass('tooltip-show')) {
      $(".tooltip").removeClass('tooltip-show').fadeOut(100);
    } else {
      $(".tooltip").addClass('tooltip-show').fadeIn(200);
    }
  });

  var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  $('#message').val("");

  $('#reset_btn').click(function() {
    $("#mensaje1").fadeOut();
    $("#mensaje2").fadeOut();
    $("#mensaje3").fadeOut();
  });

  $('#form input#telephone').on('keypress', function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
           if (charCode > 31 && (charCode < 48 || charCode > 57))
              return false;

           return true;
  });

  $("#submit_btn").click(function(e){
    e.preventDefault();
    var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    var characterReg = /^([a-zA-Z0-9]{10})$/;
    var characterReg1 = /^([a-zA-Z0-9]{2})$/;

    var nombre   = $("#name").val();
    var email    = $("#email").val();
    var mensaje  = $("#message").val();

    check_name();
    check_email();
    check_message();

    function check_name(){
      if(nombre === ""){
        $('#name').addClass('error');
        $('.errores').show();
        return false;
      }else{
        $('#name').removeClass('error');
        return true;
      }
    }

    function check_email(){
      if(email === "" || !expr.test(email)){
        $('#email').addClass('error');
        $('.errores').show();
        return false;
      }else{
        $('#email').removeClass('error');
        return true;
      }
    }

    function check_message(){
      if(mensaje === "" || mensaje == undefined){
        $('#message').addClass('error');
        $('.errores').show();
        return false;
      }else{
        $('#message').removeClass('error');
        return true;
      }
    }

    if (check_name() && check_email() && check_message()) {
      $('.errores').hide();
      var datos = $("#form").serialize(); 
      $.ajax({
                 type: "POST",
                 url: 'mandalo.php',
                 data: datos,
                 success: function(data)
                 {
                      var content = JSON.parse(data);
                      if (content.info=="success"){
                        $("#mensaje").fadeIn('fast').html('<div class="chido">'+content.msg+'</div>');
                      }else{
                        $("#mensaje").fadeIn('fast').html('<div class="nel">'+content.msg+'</div> <br /> <div id="backError" onClick="back();"> << Reintentar </div>');

                      }
                      //alert('enviado');
                 },
                 beforeSend: function(){
                  $('#form').fadeOut(500);
                  $("#mensaje").fadeIn(100).html("<div class='load'><img src='images/loading.gif' /></div>");
                 }
               });
    }
  });

  $('.container-comunidad').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '50px',
    adaptiveHeight: true,
    draggable: false,
    dots: true
  });

  $('.container-galeria').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    centerPadding: '50px',
    adaptiveHeight: true,
    dots: true,
    autoplay: false,
    autoplaySpeed: 2500,
    responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
  });

  $(".tipos-comunidad, .imagen-comunidad").click(function(e){
    e.preventDefault();
    slideIndex = $(this).attr('data-index');
    $('.container-comunidad').slick('slickGoTo', parseInt(slideIndex) );
});

$('.container_map').on('click', function(){
  $('.tooltip_map').toggleClass('show');
});

$("a.gallery-fancy").fancybox();

});
