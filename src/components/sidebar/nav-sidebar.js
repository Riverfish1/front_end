/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/components/sidebar/nav-sidebar.html',
], function ($, _, Backbone, tpl) {
	'use strict';
	var headerView = Backbone.View.extend({
        tagName:  'div',
        template: _.template(tpl),
		events: {
            'click a.item':	'active',
		},
		initialize:function(){

		},
		render:function(){
            this.$el.html(this.template());
			return this;
		},
        active: function(e) {
			var $el = $(e.target);
            $el = $el.hasClass('item') ? $el : $el.parents('.item');
            var $subNav = $el.next(),
                $parentLi = $el.parent(),
                $parentUl = $parentLi.parent(),
                level = $parentUl.hasClass('nav-sub') ? 1 : 0;

            if (level == 0) {
                var $otherSubNav = $parentUl.find('.active').not($parentLi).removeClass('open active').find('.nav-sub');
                $otherSubNav.stop().slideUp('slow');
                $parentLi.addClass('active').toggleClass('open');
                $subNav.stop();
                if ($parentLi.hasClass('open')) {
                    $subNav.slideDown('slow');
                } else {
                    $subNav.find('.active').removeClass('active');
                    $subNav.slideUp('slow');
                }
            } else {
                $parentUl.find('.active').not($parentLi).removeClass('active');
                $parentLi.addClass('active');
            }
        }
	});
	return headerView;
});