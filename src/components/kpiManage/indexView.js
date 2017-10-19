/*global define*/
define([
    'text!./index.html',
    'text!./kpiSelect.html',
    'text!./targetSelect.html',
    '../../common/query/index'
], function (tpl, kpiSelect, targetSelect, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getKpiSelectContent: _.template(kpiSelect),
        getTargetNumSelectContent: _.template(targetSelect),
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
            this.$kpiSel = this.$submitForm.find('#kpiSel');
            this.$targetNumSel = this.$submitForm.find('#targetNumSel');
            this.$performance = this.$submitForm.find('#performance');
            this.$postKpi = this.$submitForm.find('#postKpi');
            this.getKpiList();
            this.getTargetNumList();
            return this;
        },
        // 获取关键业务指标下拉列表
        getKpiList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.KPI_ITEM_SELECT, JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$kpiSel.html(self.getKpiSelectContent(list));
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        // 获取目标数值下拉列表
        getTargetNumList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.TARGET_NUM_ITEMS_SELECT , JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$targetNumSel.html(self.getTargetNumSelectContent(list));
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        initSubmitForm: function () {
            this.$submitForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    kpi: {
                        required: true
                    },
                    targetNum: {
                        required: true
                    },
                    performance: {
                        required: true
                    },
                    postKpi: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    kpi: {
                        required: "请选择关键业务指标"
                    },
                    targetNum: {
                        required: "请选择目标数值"
                    },
                    performance: {
                        required: "请填写完成情况"
                    },
                    postKpi: {
                        equired: "请填写岗位指标设定",
                        maxlength: 50
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
                var JSONData = JSON.parse(datas);
                console.log(JSONData);
                JSONData.userId = window.ownerPeopleId;
                var kpi = this.$kpiSel.val();
                var targetNum = this.$targetNumSel.val();
                var performance = this.$performance.val();
                var postKpi = this.$postKpi.val();
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
                    message: '<div class="tipInfo tipConfirm"><p>时间范围：' + JSONData.startDate + ' —— ' + JSONData.endDate + '</p><p>关键业务指标：' + kpi + "</p><p>目标数值：" + targetNum + '</p><p>完成情况：' + performance + '</p><p>岗位指标设定：' + postKpi + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(QUERY.KPI_MANAGE_INSERT, JSON.stringify(JSONData), function (res) {
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