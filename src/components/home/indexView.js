/*global define*/
define([
    './toDoTableView',
    './workMeetingTableView',
    './workStaffTableView',
    './calendarTableView',
    '../../common/calendar/calendar',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (ToDoTableView, WorkMeetingTableView, WorkStaffTableView, CalendarTableView, calendar, tpl, dialogTpl, QUERY) {
    'use strict';
    var TabView = Backbone.View.extend({
        default: {
            items: ["待办事宜", "公文待办", "日常事务"]
        },
        el: '#app',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click .btn-addDate': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            this.value = 0;
            this._bindEvent();
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        _selet1stTab: function () {
            // debugger;
            this.$el.find("a:first").tab('show')
        },
        _bindEvent: function () {
            this.$el.on('shown.bs.tab', $.proxy(this._doShowBSTab, this));
        },
        _doShowBSTab: function (e) {
            // debugger;
            var $el = $(e.target);
            if ($el.length > 0) {
                this.value = $el.attr('data-value');
                this.onTabClick(this.value);
            }
        },
        onTabClick: function (index) {
            this.createDetailView(index);
        },
        createDetailView: function (index) {
            this.todoTable = new ToDoTableView();
            this.todoTable.render(index);
        },
        createWorkMeetingTableView: function () {
            this.workMeetingTableView = new WorkMeetingTableView();
            this.workMeetingTableView.render();
        },
        createWorkStaffTableView: function () {
            this.workStaffTableView = new WorkStaffTableView();
            this.workStaffTableView.render();
        },
        createCalendarTableView: function () {
            this.calendarTableView = new CalendarTableView();
            this.calendarTableView.render();
        },
        getValue: function () {
            return this.value;
        },
        getTab: function (witch) {
            this.$el.find('li:eq('+witch+') a').tab('show');
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template(this.default));
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.$tabContent = this.$el.find('#tabContent');
            this._selet1stTab();
            this.createDetailView(0);
            //生成日历
            calendar.init('.calendarWrap');
            //最新会议
            this.createWorkMeetingTableView();
            //名片
            this.createWorkStaffTableView();
            //日程
            this.createCalendarTableView();
            return this;
        },
        addOne: function (row) {
            // debugger;
            var initData = {id: '', peopleId: '1', eventName: '', eventDescription: '', completeTime: ''};
            var row = row.id ? row : initData;
            row.completeTime = row.id && ncjwUtil.timeTurn(row.completeTime);
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            $('.completeTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true
                // format: 'yyyy-mm-dd'
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
                message: '执行删除后将无法恢复，确定继续吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.getData(QUERY.WORK_TODO_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo("删除成功");
                                that.calendarTableView.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
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
                    eventName: {
                        required: true,
                        maxlength: 50
                    },
                    eventDescription: {
                        required: true,
                        maxlength: 100
                    },
                    completeTime: {
                        required: true
                    }
                },
                messages: {
                    eventName: {
                        required: "请输入标题",
                         maxlength: "最多输入50个字符"
                    },
                    eventDescription: {
                        required: "请输入描述",
                         maxlength: "最多输入100个字符"
                    },
                    completeTime: {
                        required: "请选择时间",
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
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.WORK_TODO_UPDATE : QUERY.WORK_TODO_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.calendarTableView.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });

    return TabView;
});