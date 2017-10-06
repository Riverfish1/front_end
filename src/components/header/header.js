/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!src/components/header/header.html',
	'src/components/shotcut/indexView'
], function ($, _, Backbone, tpl, DropMenu) {
	'use strict';
	var HeaderView = Backbone.View.extend({
		el: '#header',
		tagName:  'div',
		template: _.template(tpl),
        events: {
            'mouseover .shotcutWrap':	'mouseoverShotcutMenu',
            'mouseout .shotcutWrap':	'mouseoutShotcutMenu'
        },
		initialize:function(){
			Backbone.off('routeChange').on('routeChange', this.updateNavSideBar)
			this.dropMenu = new DropMenu();
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
        mouseoverShotcutMenu: function (e) {
           var $menu = this.$el.find('.shotMenu');
           $menu.show();
        },
        mouseoutShotcutMenu: function (e) {
            var $menu = this.$el.find('.shotMenu');
            $menu.hide();
        },
		render:function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return HeaderView;
});