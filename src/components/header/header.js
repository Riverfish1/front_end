/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!src/components/header/header.html',
	'src/components/shotcut/indexView',
    'text!./dialog.html',
    '../../common/query/index'
], function ($, _, Backbone, tpl, DropMenu, dialogTpl, QUERY) {
	'use strict';
	var HeaderView = Backbone.View.extend({
		el: '#header',
        $default: {
            loginName: ''
        },
		tagName:  'div',
		template: _.template(tpl),
        getDialogTpl: _.template(dialogTpl),
        events: {
            'mouseover .shotcutWrap': 'mouseoverShotcutMenu',
            'mouseout .shotcutWrap':  'mouseoutShotcutMenu',
            'click .shotcutBtn': 'addShotcut',
            'click #set': 'handleRouter',
            'click #dialogBtnSubmit': 'submitDialogContent'
        },
        initialize: function () {
            Backbone.off('routeChange').on('routeChange', this.updateNavSideBar);
        },
        renderLogin: function () {
            var that = this;
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$editDialog.find('#editDialogPanel');
            if (window.location.host.indexOf('localhost') === -1) {
                ncjwUtil.getData(QUERY.LOGIN, {}, function(res) {
                    if (res.success) {
                        var data = res.data && res.data[0];
                        var JSONData = JSON.parse(data);
                        that.userId = JSONData.uumsUserId;
                        if (JSONData.checkValid) {
                            window.ownerPeopleId = JSONData.id;
                            window.ownerPeopleName = JSONData.peopleName;
                            window.ownerDepartmentId = JSONData.departmentId;
                            window.ownerDepartmentName = JSONData.departmentName;
                            that.$default = {
                                loginName: JSONData.peopleName
                            };
                            $('.loginName').html(that.template(that.$default));
                        } else {
                            that.$editDialog.modal('show');
                            that.$editDialog.modal({backdrop: 'static', keyboard: false});
                            that.$editDialogForm = that.editDialogPanel.find('#editDialogForm');
                            that.$editDialogPanel.empty().html(that.getDialogTpl());
                            that.initSubmitForm();
                        }
                    } else {
                        if (location.href.indexOf('120.55.36.116') > -1) {
                            window.location.href = 'http://60.190.226.163:5002/uums-server';
                        } else {
                            window.location.href = 'http://51.110.233.61:8082/uums-server';
                        }
                    }
                }, {
                    'contentType': 'application/json'
                });
            } else {
                window.ownerPeopleId = 133;
                window.ownerPeopleName = '岳灏';
            }
            this.isFirst = true;
        },
        updateNavSideBar: function (hash) {
            var hashFirst = hash.split('/')[1];
            var $header = $('header'), $li = $header.find('.headerLi');
            $li.removeClass('active');
            $li.each(function (k, el) {
                var $el = $(el), $a = $el.find('a');
                if($a.prop('href').indexOf(hashFirst) > 0){
                    $el.addClass('active');
                }
            })
        },
        mouseoverShotcutMenu: function (e) {
            // if(this.isFirst){
            //     this.$menu.find('li').removeClass('active');
            // }
            var hash = window.location.href.split("#")[1];
            var $shotLi = $('.shotMenu').find('li');
            $shotLi.removeClass('active');
            $shotLi.each(function (k, el) {
                var $el = $(el), $a = $el.find('a');
                if($a.prop('href').indexOf(hash) > 0){
                    $el.addClass('active');
                }
            })
            this.$menu.show();
            this.resetHeight();
            this.$shotcutBtn.show();
            this.isFirst = false;
        },
        mouseoutShotcutMenu: function (e) {
            this.$menu.hide();
            this.$shotcutBtn.hide();
        },
		render: function () {
			this.$el.html(this.template(this.$default));
            this.dropMenu = new DropMenu();
            this.$menu = this.$el.find('.shotMenu');
            this.$shotcutBtn = this.$el.find('.shotcutBtn');
            this.renderLogin();
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
        },
        initSubmitForm: function () {
            this.$editDialogForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    employeeNum: {
                        required: true,
                        number: true
                    },
                    peopleName: {
                        required: true,
                    },
                    phoneNum: {
                        required: true,
                        isPhoneNum: true
                    },
                    mailAddress: {
                        required: true,
                        isMailAddrss: true
                    }
                },
                messages: {
                    employeeNum: {
                        required: '请输入工号',
                        number: '必须为数字'
                    },
                    peopleName: {
                        required: '请输入名字'
                    },
                    phoneNum: {
                        required: '请输入电话号码'
                    },
                    mailAddress: {
                        required: '请输入邮箱地址'
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorPlacement: function (error, element) {
                    element.parent('div').append(error);
                }
            });
            jQuery.validator.addMethod('isPhoneNum', function(value, ele) {
                return this.optional(ele) || (QUERY.TEL_REG.test(value));
            }, '请填写正确的手机号码');
            jQuery.validator.addMethod('isMailAddrss', function(value, ele) {
                return this.optional(ele) || (QUERY.EMAIL_REG.test(value));
            }, '请填写正确的邮编号码');
        },
        submitDialogContent: function () {
            if(this.$editDialogForm.valid()){
                var that = this;
                var data = this.$editDialogForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                JSONData.userId = this.userId;
                ncjwUtil.postData(QUERY.RECORD_PEOPLE_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('信息录入成功');
                        that.$editDialog.modal('hide');
                        location.reload();
                    } else {
                        ncjwUtil.showError("信息录入失败：" + res.errorMessage);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
	});
	return HeaderView;
});
