jQuery(function($) {
    "use strict";
    var $el, $gp, leftPos, newWidth, mystr;
    $("#main_menu ul.group").append("<li id='magic-line'></li>");
    var $magicLine = $("#magic-line");
    $magicLine.width($('.current-menu-item').width()).css("left", $('.current-menu-item a').position().left).data("origLeft", $magicLine.position().left).data("origWidth", $magicLine.width());
    $("#main_menu ul li").find("a").hover(function() {
        $el = $(this);
        if ($el.parent().parent('ul').hasClass('group')) {
            leftPos = $el.position().left;
            newWidth = $el.parent().width();
            $magicLine.stop().animate({
                left: leftPos,
                width: newWidth
            });
        }
    }, function() {
        if ($('ul.group > li').hasClass('current-menu-item')) mystr = ".current-menu-item a";
        else {
            var temp = $('.current-menu-item').parents('ul.group > li').attr('id');
            mystr = '#' + temp + ' a';
        }
        $magicLine.stop().animate({
            left: $(mystr).position().left,
            width: $(mystr).parent().width()
        });
        $("#main_menu li").click(function() {
            $("#main_menu li").removeClass('current-menu-item');
            $(this).addClass('current-menu-item');
            $magicLine
        });
    });
});
