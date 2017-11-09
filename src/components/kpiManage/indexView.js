/*global define*/
define([
    'text!./index.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        events: {
            'click #btn-submit': 'submitForm'
        },
        initialize: function () {

        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$submitForm = this.$el.find('#submitForm');
            $('.startDate, .endDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                todayHighlight: true,
                autoclose: true
            });
            this.$kpiName = this.$submitForm.find('#kpiName');
            this.$targetNum = this.$submitForm.find('#targetNumber');
            this.$performance = this.$submitForm.find('#performance');
            this.$postKpi = this.$submitForm.find('#postKpi');
            this.initSubmitForm();
            return this;
        },
        initSubmitForm: function () {
            this.$submitForm.validate({
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
                        required: true,
                        date: true
                    },
                    endDate: {
                        required: true,
                        date: true
                    }
                },
                messages: {
                    kpiName: {
                        required: "请选择关键业务指标"
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
                        date: '必须为2017-09-30格式'
                    },
                    endDate: {
                        required: '请选择时间',
                        date: '必须为2017-09-30格式'
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
            if(this.$submitForm.valid()){
                var that = this;
                var $form = this.$el.find('#submitForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                datas = datas.slice(0, -2) + ',"userId":' + window.ownerPeopleId + datas.slice(-1);
                var kpi = this.$kpiName.val();
                var targetNum = this.$targetNum.val();
                var performance = this.$performance.val();
                var postKpi = this.$postKpi.val();
                var startDate = $('.startDate').val();
                var endDate = $('.endDate').val();
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认'
                        },
                        cancel: {
                            label: '取消'
                        }
                    },
                    title: "确认设定",
                    message: '<div class="tipInfo tipConfirm"><p>时间范围：' + startDate + ' —— ' + endDate + '</p><p>关键业务指标：' + kpi + "</p><p>目标数值：" + targetNum + '</p><p>完成情况：' + performance + '</p><p>岗位指标设定：' + postKpi + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(QUERY.KPI_MANAGE_INSERT, datas, function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('设定成功！');
                                } else {
                                    ncjwUtil.showError("设定失败：" + res.errorMsg);
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