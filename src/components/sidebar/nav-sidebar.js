/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!src/components/sidebar/nav-sidebar.html',
	'src/components/sidebar/navSidebarModel'
], function ($, _, Backbone, tpl, modelMap) {
	'use strict';
	var headerView = Backbone.View.extend({
		el: '#sidebar',
		tagName:  'div',
		template: _.template(tpl),
		events: {
			'click a.item':	'active'
		},
		model: modelMap['register'],
		initialize:function(){
			Backbone.on('routeChange', this.updateSideBar, this);
		},
		render:function(){
			this.$el.html(this.template({list: this.model || []}));
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
		},
        updateSideBar: function (header) {
			// debugger;
			var key = header.split('/')[1];
			this.model = modelMap[key];
			this.render();
            var $li = this.$el.find('li');
            $li.removeClass('active');
			$li.each(function (k, el) {
				var $el = $(el);
				var href = $el.find('a').prop('href').split('#')[1]
				if(href == header){
					$el.addClass('active');
				}
            })
        }
	});
	return headerView;
});