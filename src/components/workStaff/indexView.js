/*global define*/
define([
    'src/components/workStaff/tableView',
    'text!src/components/workStaff/index.html',
    'text!src/components/workStaff/dialog.html'
], function (BaseTableView, tpl, dialogTpl) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function (row) {
            var initData = {areaName: '', areaUsage: '', areaSize: '', areaAddress: '', areaPhotoAddress: '', areaDescription: ''};
            var row = row.areaName ? row : initData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        delOne: function (row) {
            var that = this;
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: '确认'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: "温馨提示",
                message: '执行删除后将无法恢复，确定继续吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.getData("/api/del/register/officeArea", {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo(res.errorMsg);
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
                            }
                        })
                    }
                }

            });
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
                    },
                    areaName: {
                        required: true,
                        maxlength: 50
                    },
                    areaUsage: {
                        required: true
                    },
                    areaName: {
                        required: true,
                        maxlength: 50
                    },
                    areaUsage: {
                        required: true,
                        maxlength: 50
                    },
                    areaName: {
                        required: true
                    },
                    areaUsage: {
                        required: true
                    },
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
                        required: "请输入编号",
                        maxlength: "最多输入50个字符"
                    },
                    areaName: {
                        required: "请输入职别",
                        maxlength: "最多输入50个字符"
                    },
                    areaUsage: {
                        required: "请选择所属部门"
                    },
                    areaName: {
                        required: "请输入手机号",
                        maxlength: "最多输入50个字符"
                    },
                    areaUsage: {
                        required: "请输入邮箱",
                        maxlength: "最多输入50个字符"
                    },
                    areaName: {
                        required: "请选择办公区"
                    },
                    areaUsage: {
                        required: "请选择办公室"
                    },
                    areaName: {
                        required: "请输入职务",
                        maxlength: "最多输入50个字符"
                    },
                    areaUsage: {
                        required: "请输入岗位",
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
                // ncjwUtil.postData("/officeArea/insert",data, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('保存成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                })
            }
        }
    });
    return View;
});