/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./department.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, departmentTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getDepartmentContent: _.template(departmentTpl),
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
            var initState = {
                departmentName: '',
                responsibility: '',
                departmentType: '',
                id: ''
            };
            var row = row.id ? row : initState;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            this.$companyBelong = this.$el.find('#companyBelong');
            this.getDepartmentList(row);
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        getDepartmentList: function(row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000,
                parentId: 0
            }
            ncjwUtil.postData(QUERY.RECORD_DEPARTMENT_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var departmentList = {departmentList: res.data && res.data[0]};
                    self.$companyBelong.empty().html(self.getDepartmentContent(departmentList));
                    (row && row.id) && ncjwUtil.setFiledsValue(self.$officeDialogPanel, {parentId: row.parentId});
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        delOne: function (row) {
            var that = this;
            var params = {
                id: row.id,
                parentId: row.parentId
            };
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
                        ncjwUtil.postData(QUERY.RECORD_DEPARTMENT_DELETE, params, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('删除成功！');
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
                    departmentName: {
                        required: true
                    },

                    responsibility: {
                        required: true
                    }
                },
                messages: {
                    departmentName: "请输入",
                    responsibility: "请输入"
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
                ncjwUtil.postData(id ? QUERY.RECORD_DEPARTMENT_UPDATE : QUERY.RECORD_DEPARTMENT_INSERT, datas, function (res) {
                     if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});