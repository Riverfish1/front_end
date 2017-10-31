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
            'click #set': 'handleRouter'
        },
        initialize:function(){
            var that = this;
            if (window.location.host.indexOf('localhost') === -1) {
                ncjwUtil.getData(QUERY.LOGIN, {}, function(res) {
                    if (res.success) {
                        var data = res.data && res.data[0];
                        var JSONData = JSON.parse(data);
                        window.ownerPeopleId = JSONData.id;
                        window.ownerPeopleName = JSONData.peopleName;
                        window.ownerDepartmentId = JSONData.departmentId;
                        window.ownerDepartmentName = JSONData.departmentName;
                        that.default = {
                            loginName: JSONData.peopleName
                        };
                        $('.loginName').html(that.template(that.default));
                    } else {
												if (location.href.match('120.55.36.116')) {
													window.location.href = 'http://60.190.226.163:5002/uums-server/?service=' + window.location.href;
												} else {
													window.location.href = 'http://51.110.233.61:8082/uums-server/?service=' + window.location.href;
												}
                    }
                }, {
                    'contentType': 'application/json'
                });
            } else {
                window.ownerPeopleId = 4;
                window.ownerPeopleName = '张三疯';
            }
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
        },
        handleRouter: function () {
					if (location.href.match('120.55.36.116')) {
						window.location.href = 'http://60.190.226.163:5002/uums-server/xtgl.htm';
					} else {
						window.location.href = 'http://51.110.233.61:8082/uums-server/xtgl.htm';
					}
          // window.location.href = 'http://' + window.location.hostname + ':8082/uums-server/xtgl.htm';
        }
	});
	return HeaderView;
});
