(function($) {
    $.fn.fullpage = function(options) {
        options = $.extend({
            'menu': false,
            'anchors': [],
            'navigation': false,
            'navigationPosition': 'right',
            'navigationColor': '#000',
            'navigationTooltips': [],
            'slidesNavigation': false,
            'slidesNavPosition': 'bottom',
            'scrollBar': false,
            'css3': true,
            'scrollingSpeed': 700,
            'autoScrolling': true,
            'easing': 'easeInQuart',
            'easingcss3': 'ease',
            'loopBottom': false,
            'loopTop': false,
            'loopHorizontal': true,
            'continuousVertical': false,
            'normalScrollElements': null,
            'scrollOverflow': false,
            'touchSensitivity': 5,
            'normalScrollElementTouchThreshold': 5,
            'keyboardScrolling': true,
            'animateAnchor': true,
            'controlArrowColor': '#fff',
            "verticalCentered": true,
            'resize': true,
            'sectionsColor': [],
            'paddingTop': 0,
            'paddingBottom': 0,
            'fixedElements': null,
            'responsive': 0,
            'sectionSelector': '.section',
            'slideSelector': '.slide',
            'afterLoad': null,
            'onLeave': null,
            'afterRender': null,
            'afterResize': null,
            'afterReBuild': null,
            'afterSlideLoad': null,
            'onSlideLeave': null
        }, options);
        displayWarnings();
        var scrollDelay = 600;
        $.fn.fullpage.setAutoScrolling = function(value) {
            options.autoScrolling = value;
            var element = $('.fp-section.active');
            if (options.autoScrolling && !options.scrollBar) {
                $('html, body').css({
                    'overflow': 'hidden',
                    'height': '100%'
                });
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });
                if (element.length) {
                    silentScroll(element.position().top);
                }
            } else {
                $('html, body').css({
                    'overflow': 'visible',
                    'height': 'initial'
                });
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });
                silentScroll(0);
                $('html, body').scrollTop(element.position().top);
            }
        };
        $.fn.fullpage.setScrollingSpeed = function(value) {
            options.scrollingSpeed = value;
        };
        $.fn.fullpage.setMouseWheelScrolling = function(value) {
            if (value) {
                addMouseWheelHandler();
            } else {
                removeMouseWheelHandler();
            }
        };
        $.fn.fullpage.setAllowScrolling = function(value) {
            if (value) {
                $.fn.fullpage.setMouseWheelScrolling(true);
            } else {
                $.fn.fullpage.setMouseWheelScrolling(false);
            }
        };
        $.fn.fullpage.setKeyboardScrolling = function(value) {
            options.keyboardScrolling = value;
        };
        $.fn.fullpage.moveSectionUp = function() {
            var prev = $('.fp-section.active').prev('.fp-section');
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $('.fp-section').last();
            }
            if (prev.length) {
                scrollPage(prev, null, true);
            }
        };
        $.fn.fullpage.moveSectionDown = function() {
            var next = $('.fp-section.active').next('.fp-section');
            if (!next.length && (options.loopBottom || options.continuousVertical)) {
                next = $('.fp-section').first();
            }
            if (next.length) {
                scrollPage(next, null, false);
            }
        };
        $.fn.fullpage.moveTo = function(section, slide) {
            var destiny = '';
            if (isNaN(section)) {
                destiny = $('[data-anchor="' + section + '"]');
            } else {
                destiny = $('.fp-section').eq((section - 1));
            }
            if (typeof slide !== 'undefined') {
                scrollPageAndSlide(section, slide);
            } else if (destiny.length > 0) {
                scrollPage(destiny);
            }
        };
        $.fn.fullpage.moveSlideRight = function() {
            moveSlide('next');
        };
        $.fn.fullpage.moveSlideLeft = function() {
            moveSlide('prev');
        };
        $.fn.fullpage.reBuild = function(resizing) {
            isResizing = true;
            var windowsWidth = $(window).width();
            windowsHeight = $(window).height();
            if (options.resize) {
                resizeMe(windowsHeight, windowsWidth);
            }
            $('.fp-section').each(function() {
                var scrollHeight = windowsHeight - parseInt($(this).css('padding-bottom')) - parseInt($(this).css('padding-top'));
                if (options.verticalCentered) {
                    $(this).find('.fp-tableCell').css('height', getTableHeight($(this)) + 'px');
                }
                $(this).css('height', windowsHeight + 'px');
                if (options.scrollOverflow) {
                    var slides = $(this).find('.fp-slide');
                    if (slides.length) {
                        slides.each(function() {
                            createSlimScrolling($(this));
                        });
                    } else {
                        createSlimScrolling($(this));
                    }
                }
                var slides = $(this).find('.fp-slides');
                if (slides.length) {
                    landscapeScroll(slides, slides.find('.fp-slide.active'));
                }
            });
            var destinyPos = $('.fp-section.active').position();
            var activeSection = $('.fp-section.active');
            if (activeSection.index('.fp-section')) {
                scrollPage(activeSection);
            }
            isResizing = false;
            $.isFunction(options.afterResize) && resizing && options.afterResize.call(this)
            $.isFunction(options.afterReBuild) && !resizing && options.afterReBuild.call(this);
        }
        var slideMoving = false;
        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        var container = $(this);
        var windowsHeight = $(window).height();
        var isMoving = false;
        var isResizing = false;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var nav;
        var wrapperSelector = 'fullpage-wrapper';
        $.fn.fullpage.setAllowScrolling(true);
        if (options.css3) {
            options.css3 = support3d();
        }
        if ($(this).length) {
            container.css({
                'height': '100%',
                'position': 'relative'
            });
            container.addClass(wrapperSelector);
        } else {
            console.error("Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");
        }
        $(options.sectionSelector).each(function() {
            $(this).addClass('fp-section');
        });
        $(options.slideSelector).each(function() {
            $(this).addClass('fp-slide');
        });
        if (options.navigation) {
            addVerticalNavigation();
        }
        $('.fp-section').each(function(index) {
            var that = $(this);
            var slides = $(this).find('.fp-slide');
            var numSlides = slides.length;
            if (!index && $('.fp-section.active').length === 0) {
                $(this).addClass('active');
            }
            $(this).css('height', windowsHeight + 'px');
            if (options.paddingTop || options.paddingBottom) {
                $(this).css('padding', options.paddingTop + ' 0 ' + options.paddingBottom + ' 0');
            }
            if (typeof options.sectionsColor[index] !== 'undefined') {
                $(this).css('background-color', options.sectionsColor[index]);
            }
            if (typeof options.anchors[index] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[index]);
            }
            if (numSlides > 1) {
                var sliderWidth = numSlides * 100;
                var slideWidth = 100 / numSlides;
                slides.wrapAll('<div class="fp-slidesContainer" />');
                slides.parent().wrap('<div class="fp-slides" />');
                $(this).find('.fp-slidesContainer').css('width', sliderWidth + '%');
                $(this).find('.fp-slides').after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');
                if (options.controlArrowColor != '#fff') {
                    $(this).find('.fp-controlArrow.fp-next').css('border-color', 'transparent transparent transparent ' + options.controlArrowColor);
                    $(this).find('.fp-controlArrow.fp-prev').css('border-color', 'transparent ' + options.controlArrowColor + ' transparent transparent');
                }
                if (!options.loopHorizontal) {
                    $(this).find('.fp-controlArrow.fp-prev').hide();
                }
                if (options.slidesNavigation) {
                    addSlidesNavigation($(this), numSlides);
                }
                slides.each(function(index) {
                    $(this).css('width', slideWidth + '%');
                    if (options.verticalCentered) {
                        addTableClass($(this));
                    }
                });
                var startingSlide = that.find('.fp-slide.active');
                if (startingSlide.length == 0) {
                    slides.eq(0).addClass('active');
                } else {
                    silentLandscapeScroll(startingSlide);
                }
            } else {
                if (options.verticalCentered) {
                    addTableClass($(this));
                }
            }
        }).promise().done(function() {
            $.fn.fullpage.setAutoScrolling(options.autoScrolling);
            var activeSlide = $('.fp-section.active').find('.fp-slide.active');
            if (activeSlide.length && ($('.fp-section.active').index('.fp-section') != 0 || ($('.fp-section.active').index('.fp-section') == 0 && activeSlide.index() != 0))) {
                silentLandscapeScroll(activeSlide);
            }
            if (options.fixedElements && options.css3) {
                $(options.fixedElements).appendTo('body');
            }
            if (options.navigation) {
                nav.find('li').eq($('.fp-section.active').index('.fp-section')).find('a').addClass('active');
                nav.find('li:first').addClass('active');
            }
            if (options.menu && options.css3 && $(options.menu).closest('.fullpage-wrapper').length) {
                $(options.menu).appendTo('body');
            }
            if (options.scrollOverflow) {
                if (document.readyState === "complete") {
                    createSlimScrollingHandler();
                }
                $(window).on('load', createSlimScrollingHandler);
            } else {
                $.isFunction(options.afterRender) && options.afterRender.call(this);
            }
            responsive();
            var value = window.location.hash.replace('#', '').split('/');
            var destiny = value[0];
            if (destiny.length) {
                var section = $('[data-anchor="' + destiny + '"]');
                if (!options.animateAnchor && section.length) {
                    if (options.autoScrolling) {
                        silentScroll(section.position().top);
                    } else {
                        silentScroll(0);
                        $('html, body').scrollTop(section.position().top);
                    }
                    activateMenuAndNav(destiny, null);
                    $.isFunction(options.afterLoad) && options.afterLoad.call(this, destiny, (section.index('.fp-section') + 1));
                    section.addClass('active').siblings().removeClass('active');
                }
            }
            $(window).on('load', function() {
                scrollToAnchor();
            });
        });

        function addVerticalNavigation() {
            $('body').append('<nav id="fp-nav"><ul></ul></nav>');
            nav = $('#fp-nav');
            nav.addClass(options.navigationPosition);
            for (var i = 0; i < $('.fp-section').length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }
                var li = '<li id="' + link + '"><a href="#' + link + '"></a><span>' + link + '</span>';
                var tooltip = options.navigationTooltips[i];
                if (tooltip != undefined && tooltip != '') {
                    li += '<div class="fp-tooltip ' + options.navigationPosition + '">' + tooltip + '</div>';
                }
                li += '</li>';
                nav.find('ul').append(li);
            }
        }

        function createSlimScrollingHandler() {
            $('.fp-section').each(function() {
                var slides = $(this).find('.fp-slide');
                if (slides.length) {
                    slides.each(function() {
                        createSlimScrolling($(this));
                    });
                } else {
                    createSlimScrolling($(this));
                }
            });
            $.isFunction(options.afterRender) && options.afterRender.call(this);
        }
        var scrollId;
        var scrollId2;
        var isScrolling = false;
        $(window).on('scroll', scrollHandler);

        function scrollHandler() {
            if (!options.autoScrolling || options.scrollBar) {
                var currentScroll = $(window).scrollTop();
                var visibleSectionIndex = 0;
                var initial = Math.abs(currentScroll - $('.fp-section').first().offset().top);
                $('.fp-section').each(function(index) {
                    var current = Math.abs(currentScroll - $(this).offset().top);
                    if (current < initial) {
                        visibleSectionIndex = index;
                        initial = current;
                    }
                });
                var currentSection = $('.fp-section').eq(visibleSectionIndex);
            }
            if (!options.autoScrolling) {
                if (!currentSection.hasClass('active')) {
                    isScrolling = true;
                    var leavingSection = $('.fp-section.active').index('.fp-section') + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink = currentSection.data('anchor');
                    currentSection.addClass('active').siblings().removeClass('active');
                    if (!isMoving) {
                        $.isFunction(options.onLeave) && options.onLeave.call(this, leavingSection, (currentSection.index('.fp-section') + 1), yMovement);
                        $.isFunction(options.afterLoad) && options.afterLoad.call(this, anchorLink, (currentSection.index('.fp-section') + 1));
                    }
                    activateMenuAndNav(anchorLink, 0);
                    if (options.anchors.length && !isMoving) {
                        lastScrolledDestiny = anchorLink;
                        location.hash = anchorLink;
                    }
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function() {
                        isScrolling = false;
                    }, 100);
                }
            }
            if (options.scrollBar) {
                clearTimeout(scrollId2);
                scrollId2 = setTimeout(function() {
                    if (!isMoving) {
                        scrollPage(currentSection);
                    }
                }, 1000);
            }
        }

        function isScrollable(activeSection) {
            if (activeSection.find('.fp-slides').length) {
                scrollable = activeSection.find('.fp-slide.active').find('.fp-scrollable');
            } else {
                scrollable = activeSection.find('.fp-scrollable');
            }
            return scrollable;
        }

        function scrolling(type, scrollable) {
            if (type == 'down') {
                var check = 'bottom';
                var scrollSection = $.fn.fullpage.moveSectionDown;
            } else {
                var check = 'top';
                var scrollSection = $.fn.fullpage.moveSectionUp;
            }
            if (scrollable.length > 0) {
                if (isScrolled(check, scrollable)) {
                    scrollSection();
                } else {
                    return true;
                }
            } else {
                scrollSection();
            }
        }
        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        function touchMoveHandler(event) {
            var e = event.originalEvent;
            if (!checkParentForNormalScrollElement(event.target)) {
                if (options.autoScrolling && !options.scrollBar) {
                    event.preventDefault();
                }
                var activeSection = $('.fp-section.active');
                var scrollable = isScrollable(activeSection);
                if (!isMoving && !slideMoving) {
                    var touchEvents = getEventsPage(e);
                    touchEndY = touchEvents['y'];
                    touchEndX = touchEvents['x'];
                    if (activeSection.find('.fp-slides').length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {
                        if (Math.abs(touchStartX - touchEndX) > ($(window).width() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                $.fn.fullpage.moveSlideRight();
                            } else {
                                $.fn.fullpage.moveSlideLeft();
                            }
                        }
                    } else if (options.autoScrolling && !options.scrollBar) {
                        if (Math.abs(touchStartY - touchEndY) > ($(window).height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                scrolling('down', scrollable);
                            } else if (touchEndY > touchStartY) {
                                scrolling('up', scrollable);
                            }
                        }
                    }
                }
            }
        }

        function checkParentForNormalScrollElement(el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();
            if (hop < options.normalScrollElementTouchThreshold && parent.is(options.normalScrollElements)) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }

        function touchStartHandler(event) {
            var e = event.originalEvent;
            var touchEvents = getEventsPage(e);
            touchStartY = touchEvents['y'];
            touchStartX = touchEvents['x'];
        }

        function MouseWheelHandler(e) {
            if (options.autoScrolling) {
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY || -e.detail)));
                if (options.scrollBar) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }
                var activeSection = $('.fp-section.active');
                var scrollable = isScrollable(activeSection);
                if (!isMoving) {
                    if (delta < 0) {
                        scrolling('down', scrollable);
                    } else {
                        scrolling('up', scrollable);
                    }
                }
                return false;
            }
        }

        function moveSlide(direction) {
            var activeSection = $('.fp-section.active');
            var slides = activeSection.find('.fp-slides');
            if (!slides.length || slideMoving) {
                return;
            }
            var currentSlide = slides.find('.fp-slide.active');
            var destiny = null;
            if (direction === 'prev') {
                destiny = currentSlide.prev('.fp-slide');
            } else {
                destiny = currentSlide.next('.fp-slide');
            }
            if (!destiny.length) {
                if (!options.loopHorizontal) return;
                if (direction === 'prev') {
                    destiny = currentSlide.siblings(':last');
                } else {
                    destiny = currentSlide.siblings(':first');
                }
            }
            slideMoving = true;
            landscapeScroll(slides, destiny);
        }

        function keepSlidesPosition() {
            $('.fp-slide.active').each(function() {
                silentLandscapeScroll($(this));
            });
        }

        function scrollPage(element, callback, isMovementUp) {
            var dest = element.position();
            if (typeof dest === "undefined") {
                return;
            }
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dest: dest,
                dtop: dest.top,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index('.fp-section'),
                activeSlide: element.find('.fp-slide.active'),
                activeSection: $('.fp-section.active'),
                leavingSection: $('.fp-section.active').index('.fp-section') + 1,
                localIsResizing: isResizing
            };
            if ((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $(window).scrollTop() === v.dtop)) {
                return;
            }
            if (v.activeSlide.length) {
                var slideAnchorLink = v.activeSlide.data('anchor');
                var slideIndex = v.activeSlide.index();
            }
            if (options.autoScrolling && options.continuousVertical && typeof(v.isMovementUp) !== "undefined" && ((!v.isMovementUp && v.yMovement == 'up') || (v.isMovementUp && v.yMovement == 'down'))) {
                v = createInfiniteSections(v);
            }
            element.addClass('active').siblings().removeClass('active');
            isMoving = true;
            if (typeof v.anchorLink !== 'undefined') {
                setURLHash(slideIndex, slideAnchorLink, v.anchorLink);
            }
            $.isFunction(options.onLeave) && !v.localIsResizing && options.onLeave.call(this, v.leavingSection, (v.sectionIndex + 1), v.yMovement);
            performMovement(v);
            lastScrolledDestiny = v.anchorLink;
            if (options.autoScrolling) {
                activateMenuAndNav(v.anchorLink, v.sectionIndex)
            }
        }

        function performMovement(v) {
            if (options.css3 && options.autoScrolling && !options.scrollBar) {
                var translate3d = 'translate3d(0px, -' + v.dtop + 'px, 0px)';
                transformContainer(translate3d, true);
                setTimeout(function() {
                    afterSectionLoads(v);
                }, options.scrollingSpeed);
            } else {
                var scrollSettings = getScrollSettings(v);
                $(scrollSettings.element).animate(scrollSettings.options, options.scrollingSpeed, options.easing).promise().done(function() {
                    afterSectionLoads(v);
                });
            }
        }

        function getScrollSettings(v) {
            var scroll = {};
            if (options.autoScrolling && !options.scrollBar) {
                scroll.options = {
                    'top': -v.dtop
                };
                scroll.element = '.' + wrapperSelector;
            } else {
                scroll.options = {
                    'scrollTop': v.dtop
                };
                scroll.element = 'html, body';
            }
            return scroll;
        }

        function createInfiniteSections(v) {
            if (!v.isMovementUp) {
                $(".fp-section.active").after(v.activeSection.prevAll(".fp-section").get().reverse());
            } else {
                $(".fp-section.active").before(v.activeSection.nextAll(".fp-section"));
            }
            silentScroll($('.fp-section.active').position().top);
            keepSlidesPosition();
            v.wrapAroundElements = v.activeSection;
            v.dest = v.element.position();
            v.dtop = v.dest.top;
            v.yMovement = getYmovement(v.element);
            return v;
        }

        function continuousVerticalFixSectionOrder(v) {
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }
            if (v.isMovementUp) {
                $('.fp-section:first').before(v.wrapAroundElements);
            } else {
                $('.fp-section:last').after(v.wrapAroundElements);
            }
            silentScroll($('.fp-section.active').position().top);
            keepSlidesPosition();
        };

        function afterSectionLoads(v) {
            continuousVerticalFixSectionOrder(v);
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(this, v.anchorLink, (v.sectionIndex + 1));
            setTimeout(function() {
                isMoving = false;
                $.isFunction(v.callback) && v.callback.call(this);
            }, scrollDelay);
        }

        function scrollToAnchor() {
            var value = window.location.hash.replace('#', '').split('/');
            var section = value[0];
            var slide = value[1];
            if (section) {
                scrollPageAndSlide(section, slide);
            }
        }
        $(window).on('hashchange', hashChangeHandler);

        function hashChangeHandler() {
            if (!isScrolling) {
                var value = window.location.hash.replace('#', '').split('/');
                var section = value[0];
                var slide = value[1];
                if (section.length) {
                    var isFirstSlideMove = (typeof lastScrolledDestiny === 'undefined');
                    var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);
                    if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide)) {
                        scrollPageAndSlide(section, slide);
                    }
                }
            }
        }
        $(document).keydown(function(e) {
            if (options.keyboardScrolling && !isMoving && options.autoScrolling) {
                switch (e.which) {
                    case 38:
                    case 33:
                        $.fn.fullpage.moveSectionUp();
                        break;
                    case 40:
                    case 34:
                        $.fn.fullpage.moveSectionDown();
                        break;
                    case 36:
                        $.fn.fullpage.moveTo(1);
                        break;
                    case 35:
                        $.fn.fullpage.moveTo($('.fp-section').length);
                        break;
                    case 37:
                        $.fn.fullpage.moveSlideLeft();
                        break;
                    case 39:
                        $.fn.fullpage.moveSlideRight();
                        break;
                    default:
                        return;
                }
            }
        });
        $(document).on('click touchstart', '#fp-nav a', function(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($('.fp-section').eq(index));
        });
        $(document).on('click touchstart', '.fp-slidesNav a', function(e) {
            e.preventDefault();
            var slides = $(this).closest('.fp-section').find('.fp-slides');
            var destiny = slides.find('.fp-slide').eq($(this).closest('li').index());
            landscapeScroll(slides, destiny);
        });
        if (options.normalScrollElements) {
            $(document).on('mouseenter', options.normalScrollElements, function() {
                $.fn.fullpage.setMouseWheelScrolling(false);
            });
            $(document).on('mouseleave', options.normalScrollElements, function() {
                $.fn.fullpage.setMouseWheelScrolling(true);
            });
        }
        $('.fp-section').on('click touchstart', '.fp-controlArrow', function() {
            if ($(this).hasClass('fp-prev')) {
                $.fn.fullpage.moveSlideLeft();
            } else {
                $.fn.fullpage.moveSlideRight();
            }
        });

        function landscapeScroll(slides, destiny) {
            var destinyPos = destiny.position();
            var slidesContainer = slides.find('.fp-slidesContainer').parent();
            var slideIndex = destiny.index();
            var section = slides.closest('.fp-section');
            var sectionIndex = section.index('.fp-section');
            var anchorLink = section.data('anchor');
            var slidesNav = section.find('.fp-slidesNav');
            var slideAnchor = destiny.data('anchor');
            var localIsResizing = isResizing;
            if (options.onSlideLeave) {
                var prevSlideIndex = section.find('.fp-slide.active').index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);
                if (!localIsResizing && xMovement !== 'none') {
                    $.isFunction(options.onSlideLeave) && options.onSlideLeave.call(this, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement);
                }
            }
            destiny.addClass('active').siblings().removeClass('active');
            if (typeof slideAnchor === 'undefined') {
                slideAnchor = slideIndex;
            }
            if (!options.loopHorizontal) {
                section.find('.fp-controlArrow.fp-prev').toggle(slideIndex != 0);
                section.find('.fp-controlArrow.fp-next').toggle(!destiny.is(':last-child'));
            }
            if (section.hasClass('active')) {
                setURLHash(slideIndex, slideAnchor, anchorLink);
            }
            var afterSlideLoads = function() {
                if (!localIsResizing) {
                    $.isFunction(options.afterSlideLoad) && options.afterSlideLoad.call(this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                }
                slideMoving = false;
            };
            if (options.css3) {
                var translate3d = 'translate3d(-' + destinyPos.left + 'px, 0px, 0px)';
                addAnimation(slides.find('.fp-slidesContainer'), options.scrollingSpeed > 0).css(getTransforms(translate3d));
                setTimeout(function() {
                    afterSlideLoads();
                }, options.scrollingSpeed, options.easing);
            } else {
                slidesContainer.animate({
                    scrollLeft: destinyPos.left
                }, options.scrollingSpeed, options.easing, function() {
                    afterSlideLoads();
                });
            }
            slidesNav.find('.active').removeClass('active');
            slidesNav.find('li').eq(slideIndex).find('a').addClass('active');
        }
        $(window).resize(resizeHandler);
        var previousHeight = windowsHeight;
        var resizeId;

        function resizeHandler() {
            responsive();
            if (isTouchDevice) {
                if ($(document.activeElement).attr('type') !== 'text') {
                    var currentHeight = $(window).height();
                    if (Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100)) {
                        $.fn.fullpage.reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            } else {
                clearTimeout(resizeId);
                resizeId = setTimeout(function() {
                    $.fn.fullpage.reBuild(true);
                }, 500);
            }
        }

        function responsive() {
            if (options.responsive) {
                var isResponsive = container.hasClass('fp-responsive');
                if ($(window).width() < options.responsive) {
                    if (!isResponsive) {
                        $.fn.fullpage.setAutoScrolling(false);
                        //$('#fp-nav').hide();
                        container.addClass('fp-responsive');
                    }
                } else if (isResponsive) {
                    $.fn.fullpage.setAutoScrolling(true);
                    //$('#fp-nav').show();
                    container.removeClass('fp-responsive');
                }
            }
        }

        function addAnimation(element, adding) {
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;
            if (adding) {
                element.removeClass('fp-notransition');
                return element.css({
                    '-webkit-transition': transition,
                    'transition': transition
                });
            }
            return removeAnimation(element);
        }

        function removeAnimation(element) {
            return element.addClass('fp-notransition');
        }

        function resizeMe(displayHeight, displayWidth) {
            var preferredHeight = 825;
            var preferredWidth = 900;
            if (displayHeight < preferredHeight || displayWidth < preferredWidth) {
                var heightPercentage = (displayHeight * 100) / preferredHeight;
                var widthPercentage = (displayWidth * 100) / preferredWidth;
                var percentage = Math.min(heightPercentage, widthPercentage);
                var newFontSize = percentage.toFixed(2);
                //$("body").css("font-size", newFontSize + '%');
            } else {
                //$("body").css("font-size", '100%');
            }
        }

        function activateNavDots(name, sectionIndex) {
            if (options.navigation) {
                $('#fp-nav').find('.active').removeClass('active');
                if (name) {
                    $('#fp-nav').find('a[href="#' + name + '"]').addClass('active');
                    $('#fp-nav').find('[id="' + name + '"]').addClass('active');
                } else {
                    $('#fp-nav').find('li').eq(sectionIndex).find('a').addClass('active');
                }
            }
        }

        function activateMenuElement(name) {
            var $magicLine = jQuery("#magic-line");
            var leftPos, newWidth;
            if (options.menu) {
                $(options.menu).find('.current').removeClass('current');
                $(options.menu).find('[data-menuanchor="' + name + '"]').addClass('current');
                $(options.menu).find('.current-menu-item').removeClass('current-menu-item');
                $(options.menu).find('[id="' + name + '"]').addClass('current-menu-item');
                leftPos = jQuery(".current-menu-item a").position().left;
                newWidth = jQuery(".current-menu-item").width();
                $magicLine.stop().animate({
                    left: leftPos,
                    width: newWidth
                });
            }
        }

        function activateMenuAndNav(anchor, index) {
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        function isScrolled(type, scrollable) {
            if (type === 'top') {
                return !scrollable.scrollTop();
            } else if (type === 'bottom') {
                return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        }

        function getYmovement(destiny) {
            var fromIndex = $('.fp-section.active').index('.fp-section');
            var toIndex = destiny.index('.fp-section');
            if (fromIndex == toIndex) {
                return 'none'
            }
            if (fromIndex > toIndex) {
                return 'up';
            }
            return 'down';
        }

        function getXmovement(fromIndex, toIndex) {
            if (fromIndex == toIndex) {
                return 'none'
            }
            if (fromIndex > toIndex) {
                return 'left';
            }
            return 'right';
        }

        function createSlimScrolling(element) {
            element.css('overflow', 'hidden');
            var section = element.closest('.fp-section');
            var scrollable = element.find('.fp-scrollable');
            if (scrollable.length) {
                var contentHeight = scrollable.get(0).scrollHeight;
            } else {
                var contentHeight = element.get(0).scrollHeight;
                if (options.verticalCentered) {
                    contentHeight = element.find('.fp-tableCell').get(0).scrollHeight;
                }
            }
            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));
            if (contentHeight > scrollHeight) {
                if (scrollable.length) {
                    scrollable.css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
                } else {
                    if (options.verticalCentered) {
                        element.find('.fp-tableCell').wrapInner('<div class="fp-scrollable" />');
                    } else {
                        element.wrapInner('<div class="fp-scrollable" />');
                    }
                    element.find('.fp-scrollable').slimScroll({
                        allowPageScroll: true,
                        height: scrollHeight + 'px',
                        size: '10px',
                        alwaysVisible: true
                    });
                }
            } else {
                removeSlimScroll(element);
            }
            element.css('overflow', '');
        }

        function removeSlimScroll(element) {
            element.find('.fp-scrollable').children().first().unwrap().unwrap();
            element.find('.slimScrollBar').remove();
            element.find('.slimScrollRail').remove();
        }

        function addTableClass(element) {
            element.addClass('fp-table').wrapInner('<div class="fp-tableCell" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element) {
            var sectionHeight = windowsHeight;
            if (options.paddingTop || options.paddingBottom) {
                var section = element;
                if (!section.hasClass('fp-section')) {
                    section = element.closest('.fp-section');
                }
                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }
            return sectionHeight;
        }

        function transformContainer(translate3d, animated) {
            addAnimation(container, animated);
            container.css(getTransforms(translate3d));
        }

        function scrollPageAndSlide(destiny, slide) {
            if (typeof slide === 'undefined') {
                slide = 0;
            }
            if (isNaN(destiny)) {
                var section = $('[data-anchor="' + destiny + '"]');
            } else {
                var section = $('.fp-section').eq((destiny - 1));
            }
            if (destiny !== lastScrolledDestiny && !section.hasClass('active')) {
                scrollPage(section, function() {
                    scrollSlider(section, slide)
                });
            } else {
                scrollSlider(section, slide);
            }
        }

        function scrollSlider(section, slide) {
            if (typeof slide != 'undefined') {
                var slides = section.find('.fp-slides');
                var destiny = slides.find('[data-anchor="' + slide + '"]');
                if (!destiny.length) {
                    destiny = slides.find('.fp-slide').eq(slide);
                }
                if (destiny.length) {
                    landscapeScroll(slides, destiny);
                }
            }
        }

        function addSlidesNavigation(section, numSlides) {
            nav.css('margin-left', '-' + (nav.width() / 2) + 'px');
            nav.find('li').first().find('a').addClass('active');
        }

        function setURLHash(slideIndex, slideAnchor, anchorLink) {
            var sectionHash = '';
            if (options.anchors.length) {
                if (slideIndex) {
                    if (typeof anchorLink !== 'undefined') {
                        sectionHash = anchorLink;
                    }
                    if (typeof slideAnchor === 'undefined') {
                        slideAnchor = slideIndex;
                    }
                    lastScrolledSlide = slideAnchor;
                    location.hash = sectionHash + '/' + slideAnchor;
                } else if (typeof slideIndex !== 'undefined') {
                    lastScrolledSlide = slideAnchor;
                    location.hash = anchorLink;
                } else {
                    location.hash = anchorLink;
                }
            }
        }

        function support3d() {
            var el = document.createElement('p'),
                has3d, transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }

        function removeMouseWheelHandler() {
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false);
                document.removeEventListener('wheel', MouseWheelHandler, false);
            } else {
                document.detachEvent("onmousewheel", MouseWheelHandler);
            }
        }

        function addMouseWheelHandler() {
            if (document.addEventListener) {
                document.addEventListener("mousewheel", MouseWheelHandler, false);
                document.addEventListener("wheel", MouseWheelHandler, false);
            } else {
                document.attachEvent("onmousewheel", MouseWheelHandler);
            }
        }

        function addTouchHandler() {
            if (isTouchDevice || isTouch) {
                MSPointer = getMSPointer();
                $(document).off('touchstart ' + MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(document).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        function removeTouchHandler() {
            if (isTouchDevice || isTouch) {
                MSPointer = getMSPointer();
                $(document).off('touchstart ' + MSPointer.down);
                $(document).off('touchmove ' + MSPointer.move);
            }
        }

        function getMSPointer() {
            var pointer;
            if (window.PointerEvent) {
                pointer = {
                    down: "pointerdown",
                    move: "pointermove"
                };
            } else {
                pointer = {
                    down: "MSPointerDown",
                    move: "MSPointerMove"
                };
            }
            return pointer;
        }

        function getEventsPage(e) {
            var events = new Array();
            if (window.navigator.msPointerEnabled) {
                events['y'] = e.pageY;
                events['x'] = e.pageX;
            } else {
                events['y'] = e.touches[0].pageY;
                events['x'] = e.touches[0].pageX;
            }
            return events;
        }

        function silentLandscapeScroll(activeSlide) {
            var prevScrollingSpeepd = options.scrollingSpeed;
            $.fn.fullpage.setScrollingSpeed(0);
            landscapeScroll(activeSlide.closest('.fp-slides'), activeSlide);
            $.fn.fullpage.setScrollingSpeed(prevScrollingSpeepd);
        }

        function silentScroll(top) {
            if (options.scrollBar) {
                container.scrollTop(top);
            } else if (options.css3) {
                var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
                transformContainer(translate3d, false);
            } else {
                container.css("top", -top);
            }
        }

        function getTransforms(translate3d) {
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform': translate3d,
                'transform': translate3d
            };
        }
        $.fn.fullpage.destroy = function(all) {
            $.fn.fullpage.setAutoScrolling(false);
            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);
            $(window).off('scroll', scrollHandler).off('hashchange', hashChangeHandler).off('resize', resizeHandler);
            $(document).off('click', '#fp-nav a').off('mouseenter', '#fp-nav li').off('mouseleave', '#fp-nav li').off('click', '.fp-slidesNav a').off('mouseover', options.normalScrollElements).off('mouseout', options.normalScrollElements);
            $('.fp-section').off('click', '.fp-controlArrow');
            if (all) {
                destroyStructure();
            }
        };

        function destroyStructure() {
            silentScroll(0);
            $('#fp-nav, .fp-slidesNav, .fp-controlArrow').remove();
            $('.fp-section').css({
                'height': '',
                'background-color': '',
                'padding': ''
            });
            $('.fp-slide').css({
                'width': ''
            });
            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });
            $('.fp-section, .fp-slide').each(function() {
                removeSlimScroll($(this));
                $(this).removeClass('fp-table active');
            });
            removeAnimation(container);
            removeAnimation(container.find('.fp-easing'));
            container.find('.fp-tableCell, .fp-slidesContainer, .fp-slides').each(function() {
                $(this).replaceWith(this.childNodes);
            });
            $('html, body').scrollTop(0);
        }

        function displayWarnings() {
            if (options.continuousVertical && (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                console && console.warn && console.warn("Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled");
            }
            if (options.continuousVertical && options.scrollBar) {
                options.continuousVertical = false;
                console && console.warn && console.warn("Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled");
            }
        }
    };
})(jQuery);
