/*global define*/
define([
    'backbone',
    'text!src/components/shotcut/index.html',
    'text!src/components/shotcut/dialog.html'
], function (Backbone, tpl, dialogTpl) {
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
            this.$officeDialog = $parent.find('#editDialog');
            this.$officeDialogPanel = $parent.find('#editPanel');
            this.getData();
            return this;
        },
        removeActiveClass: function () {
            this.$el.find('li').removeClass('active');
            // debugger;
        },
        active: function(e) {
            // debugger;
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
            ncjwUtil.getData("api/shotcut/list", {}, function (res) {
                var list = {list: res.data}
                if (res.success) {
                    self.$el.empty().html(self.template(list));
                    self.removeActiveClass();
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
        },
        getEditData: function () {
            var self = this;
            ncjwUtil.getData("api/shotcut/list", {}, function (res) {
                var list = {list: res.data}
                if (res.success) {
                    self.$officeDialogPanel.empty().html(self.getDialogContent(list))
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
        },
        addOne: function (row) {
            // debugger;
            var initData = {areaName: '', areaUsage: ''};
            var row = initData.areaName ? row : initData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.getEditData();
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    areaName: {
                        required: true,
                        maxlength: 50
                    },
                    areaUsage: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    areaName: {
                        required: "请输入部门名称",
                        maxlength: "最多输入50个字符"
                    },
                    areaUsage: {
                        required: "请输入部门编号",
                        maxlength: "最多输入50个字符"
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
        },
        submitForm: function (e) {
            if(this.$editForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var id = $('#id').val();
                ncjwUtil.postData("/api/saveOrUpdate/register/officeArea",datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('保存成功！');
                        that.$officeDialog.modal('hide');
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                })
            }
        }
    });
    return View;
});