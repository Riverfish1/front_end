/*global define*/
define([
    'text!./index.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var TabView = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        events: {
            'click #submitBtn': 'submitForm'
        },
        render: function () {
            //main view
            this.initState = {
                startDate: '',
                endDate: '',
                leaveDays: 0,
                overDays: 0
            };
            this.$el.empty().html(this.template(this.initState));
            this.$editForm = this.$el.find('#editForm');
            $('#startDate, #endDate').datepicker({
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
            e.preventDefault();
            if(this.$editForm.valid()){
                var that = this;
                var data = this.$editForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                JSONData.userId = window.ownerPeopleId;
                var JSONData1 = JSON.parse(datas);
                JSONData1.userId = window.ownerPeopleId;
                JSONData.status = 0;
                JSONData1.status = 2;
                ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_MY_QUERY, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        var leaveDays = res.total;
                        that.initState.leaveDays = leaveDays;
                        that.$el.html(that.template(that.initState));
                    } else {
                        ncjwUtil.showError("请求数据失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                });
                ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_MY_QUERY, JSON.stringify(JSONData1), function (r) {
                    if (r.success) {
                        var overDays = r.total;
                        that.initState.overDays = overDays;
                        that.$el.html(that.template(that.initState));
                    } else {
                        ncjwUtil.showError("请求数据失败：" + r.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                });
            }
        }
    });

    return TabView;
});