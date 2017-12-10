/*global define*/
define([
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    './tableView',
    '../../common/query/index'
], function (tpl, dialogTpl, viewTpl, BaseTableView, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getViewContent: _.template(viewTpl),
        events: {
            'click #btn_add': 'addOne',
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemView').on('itemView', this.viewContent, this);
        },
        render: function () {
            this.$el.empty().html(this.template());
            this.$dialog = this.$el.find('#dialog');
            this.$dialogPanel = this.$dialog.find('#dialogPanel');
            this.$viewContent = this.$el.find('#viewContent');
            this.$viewContentPanel = this.$viewContent.find('#viewPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function(row) {
            row.startDate = ncjwUtil.timeTurn(row.startDate, 'yyyy-MM-dd');
            row.endDate = ncjwUtil.timeTurn(row.endDate, 'yyyy-MM-dd');
            this.$viewContent.modal('show');
            this.$viewContent.modal({backdrop: 'static', keyboard: false});
            this.$viewContentPanel.empty().html(this.getViewContent(row));
        },
        addOne: function (row) {
            this.$dialog.modal('show');
            this.$dialog.modal({backdrop: 'static', keyboard: false});
            this.$dialogPanel.empty().html(this.getDialogContent());
            $('.startDate, .endDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$kpiForm = this.$dialog.find('#kpiForm');
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
                        ncjwUtil.postData(QUERY.KPI_MANAGE_DELETE, {id: row.id}, function (res) {
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
        initSubmitForm: function () {
            this.$kpiForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    kpiName: {
                        required: true
                    },
                    targetNumber: {
                        required: true,
                        number: true
                    },
                    performance: {
                        required: true
                    },
                    postKpi: {
                        required: true,
                        maxlength: 50
                    },
                    startDate: {
                        required: true
                    },
                    endDate: {
                        required: true
                    }
                },
                messages: {
                    kpiName: {
                        required: "请输入关键业务指标"
                    },
                    targetNumber: {
                        required: "请选择目标数值",
                        number: '必须输入数字'
                    },
                    performance: {
                        required: "请填写完成情况"
                    },
                    postKpi: {
                        equired: "请填写岗位指标设定",
                        maxlength: 50
                    },
                    startDate: {
                        required: '请选择时间',
                    },
                    endDate: {
                        required: '请选择时间'
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorkpiment: function (error, element) {
                    element.parent('div').append(error);
                }
            });
        },
        submitForm: function (e) {
            if(this.$kpiForm.valid()){
                var that = this;
                var $form = this.$el.find('#kpiForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                datas = datas.slice(0, -2) + '","userId":' + window.ownerPeopleId + datas.slice(-1);
                ncjwUtil.postData(QUERY.KPI_MANAGE_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('设定成功！');
                        that.$dialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("设定失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});