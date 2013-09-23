/*
 * Librería para Slides (for jQuery)
 * version: 1.0 (06/06/2013)
 * @requires jQuery v1.7.1 or later
 * Example: $('#idSlider').slider();
 * Change slide to left $('#idSlider').slider('scroll', 'left');
 * Change slide to right $('#idSlider').slider('scroll', 'right');
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, 2013 
 * Author: Israel Rocha [ @israel_hope ]
 * Worktrait.com
 */

(function($){
    var settings;
    $.fn.slider = function(config, params){
        
        if(config === "scroll"){
            sliderScroll(params, this);
        }else{
            settings = $.extend({}, $.fn.slider.defaults, config);
            var width_slider = $(this).outerWidth();
            $(this).each(function(){
                var slides = $(this).find(settings.slideSelector).css('width', '100%');
                $(this).data('slideWidth', slides[0].offsetWidth);
                $(this).data('pags', slides.length);

                showAllSlides(this, settings.page * slides[0].offsetWidth);
                hideSlides(this);
            });
            sliderInit();
        }
    };
    $.fn.slider.defaults = {
        parentSelector: '.slider',
        slideSelector: '.slide',
        containerSelector: '.slidesContainer',
        nextSelector: '.next_slide',
        prevSelector: '.back_slide',
        transitionTime: 300,
        animationName: 'swing',
        page: 0
    };

    function sliderInit(){
        setSliderEvents();
    }
    function setSliderEvents(){
        $(settings.nextSelector).on("click", function(e){
            e.preventDefault();
            if( !$(this).hasClass("disabled") ){
                var parentItem = $(this).parents(settings.parentSelector+':first');
                sliderScroll('right', parentItem);
            }
        });
        $(settings.prevSelector).on("click", function(e){
            e.preventDefault();
            if( !$(this).hasClass("disabled") ){
                var parentItem = $(this).parents(settings.parentSelector+':first');
                sliderScroll('left', parentItem);
            }
        });
    }
    function sliderScroll(direction, target){
        showAllSlides(target);
        position = get_position(target);
        slideWidth = $(target).data('slideWidth');
        pags = $(target).data('pags');

        totalWidth = (pags * slideWidth) - slideWidth;
        switch (direction){
            case 'right':
                if(position + slideWidth <= totalWidth){
                    $(target).animate({scrollLeft: position + slideWidth}, settings.transitionTime, settings.animationName, function(){
                        hideSlides(target);
                    });
                }
                break;
            case 'left':
                if(position - slideWidth >= 0){
                    $(target).animate({scrollLeft: position - slideWidth}, settings.transitionTime, settings.animationName, function(){
                        hideSlides(target);
                    });
                }
                break;
            default:
                hideSlides(target);
        }
    }
    function showAllSlides(target, position){
        pos = (position == undefined)? $(target).data('position') : position;
        slideWidth = $(target).data('slideWidth');
        pags = $(target).data('pags');
        $(target).find(settings.slideSelector).css({position: "static"});
        $(target).find(settings.containerSelector).css('width', slideWidth * pags);
        $(target).scrollLeft(pos);
    }
    function hideSlides(target){
        actualIndex = get_index(target);
        position = get_position(target);
        $(target).data('position', position);
        $(target).find(settings.slideSelector).each(function(index){
            if(index != actualIndex){
                $(this).css({position: "absolute", "z-index": "-1"});   
            }
        });
        $(target).find(settings.containerSelector).css('width', $(target).data('slideWidth'));
        $(target).scrollLeft(0);
    }
    function get_position(target){
        return $(target).scrollLeft();
    }
    function get_index(target){
        position = get_position(target);
        return Math.ceil(position / $(target).data('slideWidth'));
    }
})(jQuery);