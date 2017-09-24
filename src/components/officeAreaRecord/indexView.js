/*global define*/
define([
    'src/components/baseTable/indexCollection',
    'src/components/officeAreaRecord/tableView',
    'text!./index.html',
    'text!./dialog.html',
    'src/components/uploadImg/indexView',
    '../../common/query/index'
], function (BaseTableCollection, BaseTableView, tpl, dialogTpl, UploadImgView, QUERY) {
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
            this.$el.empty().html(this.template(this.model.toJSON()));
            this.$officeDialog = this.$el.find('#encoding-library-dialog');
            this.$officeDialogPanel = this.$el.find('#encodingLibrary-panl');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function (row) {
            var initState = {id: '', areaName: '', areaUsage: '', areaSize: '', areaAddress: '', areaPhotoAddress: '', areaDescription: ''};
            var row = row.id ? row : initState
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            this.uploadImg = new UploadImgView();
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
                        ncjwUtil.getData(QUERY.RECORD_OFFICEAREA_DELETE, {id: row.id}, function (res) {
                        // ncjwUtil.getData("/api/del/register/officeArea", {id: row.id}, function (res) {
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
                    areaName: {
                        required: true,
                        maxlength: 50
                    },
                    areaUsage: {
                        required: true,
                        maxlength: 50
                    },
                    areaSize: {
                        required: true,
                        number: true,
                        maxlength: 50
                    },
                    areaAddress: {
                        required: true,
                        maxlength: 50
                    },
                    areaPhotoAddress: {
                        required: true
                    },
                    areaDescription: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    areaName: {
                        required: "请输入办公区名称",
                        maxlength: "最多输入50个字符"
                    },
                    areaUsage: {
                        required: "请输入用途",
                        maxlength: "最多输入50个字符"
                    },
                    areaSize: {
                        required: "请输入面积",
                        number: "必须为数字",
                        maxlength: "最多输入50个字符"
                    },
                    areaAddress: {
                        required: "请输入地址",
                        maxlength: "最多输入50个字符"
                    },
                    areaPhotoAddress: {
                        required: "请选择图片、并上传",
                        maxlength: "最多输入50个字符"
                    },
                    areaDescription: {
                        required: "请输入描述",
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
                ncjwUtil.postData(id ? QUERY.RECORD_OFFICEAREA_UPDATE : QUERY.RECORD_OFFICEAREA_INSERT, datas, function (res) {
                // ncjwUtil.postData("/api/saveOrUpdate/register/officeArea",data, function (res) {
                // ncjwUtil.postData("/officeArea/insert",data, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("删除失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});