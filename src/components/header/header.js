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
            'mouseover .shotcutWrap': 'mouseoverShotcutMenu',
            'mouseout .shotcutWrap':  'mouseoutShotcutMenu',
            'click .shotcutBtn': 'addShotcut'
        },
        initialize:function(){
			window.ownerPeopleId = 1;
			Backbone.off('routeChange').on('routeChange', this.updateNavSideBar);
			this.isFirst = true;
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
            if(this.isFirst){
                this.$menu.find('li').removeClass('active');
            }
            this.$menu.show();
            this.resetHeight();
            this.$shotcutBtn.show();
            this.isFirst = false;
        },
        mouseoutShotcutMenu: function (e) {
            this.$menu.hide();
            this.$shotcutBtn.hide();
        },
		render:function(){
            debugger;
			this.$el.html(this.template());
            this.dropMenu = new DropMenu();
            this.$menu = this.$el.find('.shotMenu');
            this.$shotcutBtn = this.$el.find('.shotcutBtn');
			return this;
		},
        addShotcut: function () {
            Backbone.trigger('shotcutBtnClick');
            this.$menu.hide();
            this.$shotcutBtn.hide();
        },
        resetHeight: function () {
            this.$shotcutBtn.css('top', this.$menu.height() + 58);
        }
	});
	return HeaderView;
});