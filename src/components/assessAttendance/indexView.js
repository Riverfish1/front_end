/*global define*/
define([
    'text!./index.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        default: {
            items: [
            	{ name: "自动签到", active: true },
            	{ name: "请假申请", active: false },
            	{ name: "销假申请", active: false },
            	{ name: "加班申请", active: false },
            	{ name: "签退申请", active: false }
            ],
            isMark: false,
            dateNow: ncjwUtil.timeTurn(new Date(), 'yyyy-MM-dd'),
            week: ncjwUtil.getDate(new Date()),
            timeNow: ncjwUtil.timeTurn(new Date(), 'yyyy-MM-dd hh:mm').split(' ')[1],
            peopleName: '',
            departmentName: '',
            origin: '',
            startDate: '',
            endDate: '',
            days: '',
            remark: ''
        },
        el: '#main',
        template: _.template(tpl),
        events: {
            'click #btnSubmit': 'submitForm',
            'click .J_att': 'onButtonChange',
            'click #mark': 'autoMark'
        },
        initialize: function () {
        	Backbone.off('autoMark').on()
        },
        render: function () {
            //main view
            // this.$el.empty().html(this.getDetailTpl());
            this.$el.empty().html(this.template(this.default));
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
            return this;
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    origin: {
                        required: true
                    },
                    startDate: {
                        required: true
                    },
                    endDate: {
                        required: true
                    },
                    days: {
                        required: true
                    },
                    remark: {
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
        onButtonChange: function (e) {
        	var value = e.target.value;
        	$.each(this.default.items, function(i, n) {
        		if (String(i) === value) {
        			n.active = true;
        		} else {
        			n.active = false;
        		}
        	});
        	this.$el.html(this.template(this.default));
        },
        autoMark: function () {
        	var that = this;
        	var params = {
        		userId: window.ownerPeopleId,
        		checkTime: this.default.dateNow
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
                message: '确定签到吗？',
                callback: function (result) {
                    if (result) {
			        	ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_CHECK, JSON.stringify(params), function(res) {
			        		if (res.success) {
			        			that.default.isMark = true;
			        			that.$editForm.html(that.template(that.default));
			        		}
			        	}, {
			        		'contentType': 'application/json'
			        	});
                    }
                }

            });
        },
        submitForm: function () {}
    });

    return View;
});