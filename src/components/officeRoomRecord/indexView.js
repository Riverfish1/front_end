/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./area.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, areaTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getAreaContent: _.template(areaTpl),
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
            var initState = {
                officeAreaId: '',
                officeRoomName: '',
                officeRoomFunction: '',
                officeSize: '',
                officeCapacity: '',
                officeUsage: '',
                id: ''
            };
            var row = row.id ? row : initState;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            this.$officeAreaBelong = this.$officeDialogPanel.find('#officeAreaBelong');
            this.getOfficeAreaList(row);
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        getOfficeAreaList: function (row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEAREA_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$officeAreaBelong.empty().html(self.getAreaContent(list));
                    if (row && row.id) {
                        ncjwUtil.setFiledsValue(self.$officeDialogPanel, {officeAreaId: row.officeAreaId});
                        ncjwUtil.setFiledsValue(self.$officeDialogPanel, {officeRoomFunction: row.officeRoomFunction});
                    }
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
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
                        ncjwUtil.postData(QUERY.RECORD_OFFICEROOM_DELETE, {id: row.id}, function (res) {
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
                    officeAreaId: {
                        required: true
                    },
                    officeRoomName: {
                        required: true
                    },
                    officeRoomFunction: {
                        required: true
                    },
                    officeSize: {
                        required: true,
                        number: true
                    },
                    officeCapacity: {
                        required: true,
                        number: true
                    },
                    officeUsage: {
                        required: true
                    }
                },
                messages: {
                    officeAreaId: '请选择',
                    officeRoomName: '请输入',
                    officeRoomFunction: '请输入',
                    officeSize: {
                        required: '请输入',
                        number: '请输入数字'
                    },
                    officeCapacity: {
                        required: '请输入',
                        number: '请输入数字'
                    },
                    officeUsage: '请输入'
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
                ncjwUtil.postData(id ? QUERY.RECORD_OFFICEROOM_UPDATE : QUERY.RECORD_OFFICEROOM_INSERT, datas, function (res) {
                     if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("修改失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});