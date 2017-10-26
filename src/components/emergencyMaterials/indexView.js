/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            name: '',
            id: '',
            num: '',
            type: '',
            warning: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #assetSubmitBtn': 'submitForm',
        },
        initialize: function () {
            Backbone.off('assetsEdit').on('assetsEdit', this.addOne, this);
            Backbone.off('assetsDelete').on('assetsDelete', this.delOne, this);
            Backbone.off('assetsReceive').on('assetsReceive', this.receiveAsset, this);
        },
        render: function () {
            this.$el.empty().html(this.template());
            this.$assetsDialog = this.$el.find('#assetsOne');
            this.$assetsDialogPanel = this.$assetsDialog.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function (row) {
            var row = row.id ? row : this.initialData;
            this.$assetsDialog.modal('show');
            this.$assetsDialog.modal({backdrop: 'static', keyboard: false});
            this.$assetsDialogPanel.empty().html(this.getDialogContent(row));
            this.$assetEditForm = this.$assetsDialog.find('#assetEditForm');
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
                        ncjwUtil.postData(QUERY.ASSETS_EMERGENCY_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('删除成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
                            }
                        })
                    }
                }

            });
        },
        receiveAsset: function (row) {
            var that = this;
            var params = {
                id: row.id,
                status: 1
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
                message: '确定领用吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.ASSETS_EMERGENCY_UPDATE, JSON.stringify(params), function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('领用成功！');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("领用失败：" + res.errorMsg);
                            }
                        }, {
                            'contentType': 'application/json'
                        });
                    }
                }

            });  
        },
        initSubmitForm: function () {
            this.$assetEditForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    name: {
                        required: true
                    },
                    num: {
                        required: true
                    },
                    type: {
                        required: true
                    },
                    warning: {
                        required: true
                    }
                },
                messages: {
                    name: "请输入名称",
                    num: "请输入数量",
                    type: "请输入类型",
                    warning: "请输入预警"
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
            if(this.$assetEditForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#assetEditForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.ASSETS_EMERGENCY_UPDATE : QUERY.ASSETS_EMERGENCY_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$assetsDialog.modal('hide');
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