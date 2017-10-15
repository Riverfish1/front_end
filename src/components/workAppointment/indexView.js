/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, viewTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getViewContent: _.template(viewTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemUpdate').on('itemUpdate', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemAdd').on('itemAdd', this.addOne, this);
            Backbone.off('itemView').on('itemView', this.viewContent, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$officeDialog.find('#editPanel');
            this.$viewDialog = this.$el.find('#viewDialog');
            this.$viewDialogPanel = this.$viewDialog.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function (row) {
            this.$viewDialog.modal('show');
            this.$viewDialog.modal({backdrop: 'static', keyboard: false});
            row.startTime = ncjwUtil.timeTurn(row.startTime);
            row.endTime = ncjwUtil.timeTurn(row.endTime);
            this.$viewDialogPanel.empty().html(this.getViewContent(row));
        },
        addOne: function (row) {
            var initState = {
                recordName: '',
                recordResult: '',
                startTime: '',
                endTime: '',
                id: ''
            };
            var row = row.id ? row : initState;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            $('.startTime, .endTime').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:00',
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true
            });
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
                message: '确认取消此次预约吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.WORK_APPOINTMENT_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('取消成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("取消失败：" + res.errorMsg);
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
                    recordName: {
                        required: true
                    },
                    recordResult: {
                        required: true
                    },
                    startTime: {
                        required: true
                    },
                    endTime: {
                        required: true
                    }
                },
                messages: {
                    recordName: "请输入姓名",
                    recordResult: "请输入原因",
                    startTime: '请选择开始时间',
                    endTime: '请选择结束时间'
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
                ncjwUtil.postData(id ? QUERY.WORK_APPOINTMENT_UPDATE : QUERY.RECORD_PEOPLE_INSERT, datas, function (res) {
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