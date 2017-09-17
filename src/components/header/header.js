/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!src/components/header/header.html'
], function ($, _, Backbone, tpl) {
	'use strict';
	var HeaderView = Backbone.View.extend({
		el: '#header',
		tagName:  'div',
		template: _.template(tpl),
        // events: {
        //     'click a':	'updateNavSideBar'
        // },
		initialize:function(){
			Backbone.off('routeChange').on('routeChange', this.updateNavSideBar)
		},
        updateNavSideBar: function (hash) {
            var hashFirst = hash.split('/')[1];
            var $header = $('header'), $li = $header.find('li');
            $li.removeClass('active');
            $li.each(function (k, el) {
                var $el = $(el), $a = $el.find('a');
                if($a.prop('href').indexOf(hashFirst) > 0){
                    $el.addClass('active');
                }
            })
        },
		render:function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return HeaderView;
});