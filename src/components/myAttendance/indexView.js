/*global define*/
define([
    'text!./index.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var TabView = Backbone.View.extend({
        el: '#toolbar',
        template: _.template(tpl),
        events: {
            'click #submitBtn': 'submitForm'
        },
        render: function () {
            //main view
            var initState = {
                startDate: '',
                endDate: '',
                leaveDays: 0,
                overDays: 0
            };
            this.$el.empty().html(this.template());
            this.$editForm = this.$el.find('#editForm');
            $('.startDate, .endDate').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true
            });
            this.initSubmitForm();
            return this;
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    startDate: {
                        required: true
                    },
                    endDate: {
                        required: true
                    }
                },
                messages: {
                    startDate: {
                        required: "请选择开始日期",
                    },
                    endDate: {
                        required: "请选择结束日期"
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
                var data = this.$editForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                JSONData.userId = window.ownerPeopleId;
                JSONData.status = 0;
                ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_MY_QUERY, JSON.stringify(datas), function (res) {
                    if (res.success) {
                        var total = res.total;
                        that.$el.html(that.template({leaveDays: total}));
                        JSONData.status = 2;
                        ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_MY_QUERY, JSON.stringify(datas), function (r) {
                            if (r.success) {
                                var total = r.total;
                                that.$el.html(that.template({overDays: total}));
                            } else {
                                ncjwUtil.showError("请求数据失败：" + res.errorMsg);
                            }
                        }, {
                            "contentType": 'application/json'
                        })
                    } else {
                        ncjwUtil.showError("请求数据失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });

    return TabView;
});