/*global define*/
define([
    'src/components/workMeetingSchedule/tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./select.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, selectTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getSelectContent: _.template(selectTpl),
        events: {
            'click #btn_add': 'changeMetting',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemCancel').on('itemCancel', this.cangelMeeting, this);
            Backbone.off('itemChange').on('itemChange', this.changeMetting, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#encoding-library-dialog');
            this.$officeDialogPanel = this.$el.find('#encodingLibrary-panl');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        changeMetting: function (row) {
            var initState = {id: '', areaName: '', areaUsage: '', areaSize: '', areaAddress: '', areaPhotoAddress: ''};
            var row = row.id ? row : initState
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
            this.$officeAreaSel = this.$officeDialogPanel.find('#officeAreaSel');
            this.$officeRoomSel = this.$officeDialogPanel.find('#officeRoomSel');
            this.getOfficeAreaList();
            this.getOfficeRoomList();
            this.$editForm = this.$el.find('#editForm');
            row.id  && ncjwUtil.setFiledsValue(this.$officeDialogPanel, row);
            this.initSubmitForm();
        },
        cangelMeeting: function (row) {
            var that = this;
            row.time = ncjwUtil.timeTurn(new Date().getTime());
            row.areaName = "A办公区";
            row.areaRoom = "a会议室";
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: '确认'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: "退订会议",
                message: '<div class="tipInfo">你确定退订会议室？<p><span>'+ row.time +'</span><span>' + row.areaName + "——" + row.areaRoom +'</span></p></div>',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.getData(QUERY.RECORD_OFFICEAREA_DELETE, {id: row.id}, function (res) {
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
        getOfficeAreaList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEAREA_QUERY , params, function (res) {
                if (res.success) {
                    var list = {list: res.data};
                    self.$officeAreaSel.empty().html(self.getSelectContent(list))
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getOfficeRoomList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEROOM_QUERY , params, function (res) {
                if (res.success) {
                    var list = {list: res.data};
                    self.$officeRoomSel.empty().html(self.getSelectContent(list))
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
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
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认'
                        },
                        cancel: {
                            label: '取消'
                        }
                    },
                    title: "预定确认",
                    message: '<div class="tipInfo tipConfirm"><p>' + data.areaName + "——" + data.areaRoom + '</p><p>'+ ncjwUtil.timeTurn(new Date().getTime()) +'</p><p>会议主题：' + data.topic + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(id ? QUERY.RECORD_OFFICEAREA_UPDATE : QUERY.RECORD_OFFICEAREA_INSERT, datas, function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('预定成功！');
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
            }
        }
    });
    return View;
});