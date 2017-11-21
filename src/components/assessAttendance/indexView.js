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
        },
        render: function () {
            //main view
            // this.$el.empty().html(this.getDetailTpl());
            var id = window.ownerPeopleId;
            var that = this;
            ncjwUtil.postData(QUERY.RECORD_PEOPLE_SELECT_BY_ID, {id: id}, function(res) {
            	if (res.success) {
            		var data = res.data && res.data[0];
            		that.default.peopleName = data.peopleName;
            		that.default.departmentName = data.departmentName;
		            that.$el.empty().html(that.template(that.default));
            	}
            });
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
                        required: true,
                        number: true
                    }
                },
                messages: {
                    origin: "请输入事由",
                    startDate: "请选择开始日期",
                    endDate: '请选择结束日期',
                    days: '请输入天数'
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
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        	
            $('#startDate, #endDate').datepicker({
            	language: 'zh-CN',
            	format: 'yyyy-mm-dd',
            	autoclose: true,
            	todayHighlight: true
            });
        },
        autoMark: function (e) {
        	e.preventDefault();
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
			        			that.$el.html(that.template(that.default));
			        		}
			        	}, {
			        		'contentType': 'application/json'
			        	});
                    }
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
                datas = datas.slice(0, -2) + '","userId":"' + window.ownerPeopleId + datas.slice(-1);
                datas = datas.slice(0, -1) + '","status":' + ($('.statusInput').val() - 1) + datas.slice(-1);
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
	                message: '确定提交吗？',
	                callback: function (result) {
	                    if (result) {
				        	ncjwUtil.postData(QUERY.ASSESS_ATTENDANCE_INSERT, datas, function (res) {
			                    if (res.success) {
                                    ncjwUtil.showInfo("提交成功！");
			                    } else {
			                        ncjwUtil.showError(res.errorMessage);
			                    }
			                }, {
			                    "contentType": 'application/json'
			                });
	                    }
	                }

	            });
                
            }
        }
    });

    return View;
});