/*global define*/
define([
    'text!src/components/shotcut/index.html',
    'text!src/components/shotcut/dialog.html'
], function (tpl, dialogTpl) {
    'use strict';
    var View = Backbone.View.extend({
        el: '.shotMenu',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
        },
        render: function () {
            //main view
            // this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            return this;
        },
        getData: function () {
            ncjwUtil.getData("api/shotcut/list", function (res) {
                if (res.success) {
                    this.$el.empty().html(this.template(res.data[0]));
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
        },
        addOne: function (row) {
            var initData = {areaName: '', areaUsage: ''};
            var row = initData.areaName ? row : initData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
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