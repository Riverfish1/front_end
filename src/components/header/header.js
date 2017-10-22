/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!src/components/header/header.html',
	'src/components/shotcut/indexView',
    '../../common/query/index'
], function ($, _, Backbone, tpl, DropMenu, QUERY) {
	'use strict';
	var HeaderView = Backbone.View.extend({
		el: '#header',
        default: {
            loginName: ''
        },
		tagName:  'div',
		template: _.template(tpl),
        events: {
            'mouseover .shotcutWrap': 'mouseoverShotcutMenu',
            'mouseout .shotcutWrap':  'mouseoutShotcutMenu',
            'click .shotcutBtn': 'addShotcut',
            'click .logout': 'loginOut'
        },
        loginOut: function () {
            window.location.href = 'http://60.190.226.163:5002/uums-server/?service=' + location.href;
        },
        initialize:function(){
            var that = this;
            ncjwUtil.getData(QUERY.LOGIN, {}, function(res) {
                console.log(res);
                if (res.success) {
                    var data = res.data && res.data[0];
                    var JSONData = JSON.parse(data);
                    window.ownerPeopleId = JSONData.id;
                    window.ownerPeopleName = JSONData.peopleName;
                    that.default = {
                        loginName: JSONData.peopleName
                    };
                    that.$el.html(that.template(that.default));
                } else {
                    window.location.href = 'http://60.190.226.163:5002/uums-server/?service=' + window.location.href;
                }
            }, {
                'contentType': 'application/json'
            });
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
			this.$el.html(this.template(this.default));
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