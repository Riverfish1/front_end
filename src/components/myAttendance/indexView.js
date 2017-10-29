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
                        var data = res.data ? res.data[0] : [];
                        $('.leave_day').text(leaveDays);
                        $('#leave_table').bootstrapTable({
                            data: data,
                            toolbar: '#toolbar', //工具按钮用哪个容器
                            striped: true, //是否显示行间隔色
                            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                            pagination: false, //是否显示分页（*）
                            sortable: false, //是否启用排序
                            uniqueId: "id", //每一行的唯一标识，一般为主键列
                            columns: [{
                                field: 'startDate',
                                title: '开始日期',
                                align: 'center',
                                valign: "middle",
                                formatter: function(value) {
                                    return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                                }
                            }, {
                                field: 'days',
                                title: '天数',
                                align: 'center',
                                valign: 'middle'
                            }, {
                                field: 'endDate',
                                title: '结束日期',
                                align: 'center',
                                valign: "middle",
                                formatter: function(value) {
                                    return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                                }
                            }, {
                                field: 'origin',
                                title: '事由',
                                align: 'center',
                                valign: "middle"
                            }, {
                                field: 'remark',
                                title: '备注',
                                align: 'center',
                                valign: "middle",
                            }]
                        });
                    } else {
                        ncjwUtil.showError("请求数据失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                });
                ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_MY_QUERY, JSON.stringify(JSONData1), function (r) {
                    if (r.success) {
                        var overDays = r.total;
                        var data = r.data ? r.data[0] : [];
                        $('.over_day').text(overDays);
                        $('#over_table').bootstrapTable({
                            data: data,
                            toolbar: '#toolbar', //工具按钮用哪个容器
                            striped: true, //是否显示行间隔色
                            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                            pagination: false, //是否显示分页（*）
                            sortable: false, //是否启用排序
                            uniqueId: "id", //每一行的唯一标识，一般为主键列
                            columns: [{
                                field: 'startDate',
                                title: '开始日期',
                                align: 'center',
                                valign: "middle",
                                formatter: function(value) {
                                    return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                                }
                            }, {
                                field: 'days',
                                title: '天数',
                                align: 'center',
                                valign: 'middle'
                            }, {
                                field: 'endDate',
                                title: '结束日期',
                                align: 'center',
                                valign: "middle",
                                formatter: function(value) {
                                    return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                                }
                            }, {
                                field: 'origin',
                                title: '事由',
                                align: 'center',
                                valign: "middle"
                            }, {
                                field: 'remark',
                                title: '备注',
                                align: 'center',
                                valign: "middle",
                            }]
                        });
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