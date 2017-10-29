/*global define*/
define([
    'backbone',
    'text!src/components/shotcut/index.html',
    'text!src/components/shotcut/dialog.html',
    '../../common/query/index'
], function (Backbone, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '.shotMenu',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click a.item':	'active',
            'click .shotcutBtn': 'addOne'
        },
        initialize: function () {
            Backbone.off('shotcutBtnClick').on('shotcutBtnClick', this.addOne, this);
            this.render();
        },
        render: function () {
            var $parent = this.$el.parents('#navbar');
            this.$editDialog = $parent.find('#editDialog');
            this.$editPanel = $parent.find('#editPanel');
            this.getData();
            return this;
        },
        removeActiveClass: function () {
            this.$el.find('li').removeClass('active');
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
        getData: function () {
            var self = this;
            var params = {
                userId: window.ownerPeopleId,
                checked: 1
            };
            ncjwUtil.postData(QUERY.WORK_SHOT_QUERY, JSON.stringify(params), function (res) {
                var list = {list: (res.data && res.data[0]) || []}
                if (res.success) {
                    self.$el.empty().html(self.template(list));
                    self.removeActiveClass();
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getEditData: function () {
            var self = this;
            ncjwUtil.postData(QUERY.WORK_SHOT_QUERY, JSON.stringify({userId: window.ownerPeopleId}), function (res) {
                var list = {list: (res.data && res.data[0]) || []}
                if (res.success) {
                    self.$editPanel.empty().html(self.getDialogContent(list))
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            }, {
                "contentType": 'application/json'
            })
        },
        addOne: function (row) {
            // debugger;
            var initData = {areaName: '', areaUsage: ''};
            var row = initData.areaName ? row : initData;
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.getEditData();
            this.$editForm = this.$el.find('#editForm');
            this.$submitBtn = this.$editDialog.find('#submitBtn');
            this.$submitBtn.off().on('click', $.proxy(this.submitForm, this))
            // this.initSubmitForm();
        },
        // initSubmitForm: function () {
        //     this.$editForm.validate({
        //         errorElement: 'span',
        //         errorClass: 'help-block',
        //         focusInvalid: true,
        //         rules: {
        //             areaName: {
        //                 required: true,
        //                 maxlength: 50
        //             },
        //             areaUsage: {
        //                 required: true,
        //                 maxlength: 50
        //             }
        //         },
        //         messages: {
        //             areaName: {
        //                 required: "请输入部门名称",
        //                 maxlength: "最多输入50个字符"
        //             },
        //             areaUsage: {
        //                 required: "请输入部门编号",
        //                 maxlength: "最多输入50个字符"
        //             }
        //         },
        //         highlight: function (element) {
        //             $(element).closest('.form-group').addClass('has-error');
        //         },
        //         success: function (label) {
        //             label.closest('.form-group').removeClass('has-error');
        //             label.remove();
        //         },
        //         errorPlacement: function (error, element) {
        //             element.parent('div').append(error);
        //         }
        //     });
        // },
        submitForm: function (e) {
            var that = this;
            var params = this.getCheck();
            if(params.length > 0){
                ncjwUtil.postData(QUERY.WORK_SHOT_UPDATE, JSON.stringify(params), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('保存成功！');
                        that.$editDialog.modal('hide');
                        //刷新快捷方式菜单
                        that.getData();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }else{
                ncjwUtil.showInfo('请选择快捷方式！');
            }
        },
        getCheck: function () {
            var $input = this.$editPanel.find('input');
            var params = [];
            var obj = {};
            $.each($input, function (k, el) {
                obj.id = $(el).val();
                obj.userId = window.ownerPeopleId;
                obj.menuName = $(el).attr('data-name');
                obj.checked = $(el).prop('checked') == true ? 1 : 0;
                params.push(obj);
                obj = {};
            })
            return params;
        }
    });
    return View;
});