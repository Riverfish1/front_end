/*global define*/
define([
    'backbone',
    'src/components/workMeetingSchedule/tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./select.html',
    'text!./roomSel.html',
    '../../common/query/index'
], function (Backbone, BaseTableView, tpl, dialogTpl, selectTpl, roomSel, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getSelectContent: _.template(selectTpl),
        getRoomSelectContent: _.template(roomSel),
        events: {
            'click #btn_add': 'changeMeeting',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemCancel').on('itemCancel', this.cangelMeeting, this);
            Backbone.off('itemChange').on('itemChange', this.changeMeeting, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#encoding-library-dialog');
            this.$officeDialogPanel = this.$el.find('#encodingLibrary-panl');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        changeMeeting: function (row) {
            var initState = {id: '', userId: 100, startTime: '', endTime: '', place: '', conferenceRoom: '', conferenceTheme: ''};
            var row = row.id ? row : initState
            row.startTime = row.id ? ncjwUtil.timeTurn(row.startTime) : '';
            row.endTime = row.id ? ncjwUtil.timeTurn(row.endTime) : '';
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
            this.$officeAreaSel = this.$officeDialogPanel.find('#officeAreaSel');
            this.$officeRoomSel = this.$officeDialogPanel.find('#officeRoomSel');
            this.$conferenceTheme = this.$officeDialogPanel.find('#conferenceTheme');
            this.$startTime = this.$officeDialogPanel.find('.startTime');
            this.$endTime = this.$officeDialogPanel.find('.endTime');
            this.getOfficeAreaList(row);
            this.getOfficeRoomList(row);
            this.$editForm = this.$el.find('#editForm');
            row.id  && ncjwUtil.setFiledsValue(this.$officeDialogPanel, row);
            $('.startTime, .endTime').datetimepicker({
                autoclose: true,
                format: 'yyyy-mm-dd hh:ii:00',
                language: 'zh-CN',
                todayHighlight: true
            });
            $('.startTime').datetimepicker({
                startDate: true
            });
            $('.endTime').datetimepicker({
                endDate: true
            });
            this.initSubmitForm();
        },
        cangelMeeting: function (row) {
            var that = this;
            var startTime = ncjwUtil.timeTurn(row.startTime);
            var endTime = ncjwUtil.timeTurn(row.endTime);
            var startWeek = "周" + "日一二三四五六".charAt(new Date(startTime).getDay());
            var endWeek = "周" + "日一二三四五六".charAt(new Date(endTime).getDay());
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: '确认'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: "退订会议",
                message: '<div class="tipInfo">你确定退订会议室？<p><span>'+ startTime + '('+ startWeek +')' + '至' + endTime + '(' + endWeek + ')</span><span>' + row.place + "——" + row.conferenceRoom +'</span></p></div>',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.getData(QUERY.WORK_MEETING_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('删除成功！');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
                            }
                        })
                    }
                }

            });
        },
        getOfficeAreaList: function (row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEAREA_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$officeAreaSel.empty().html(self.getSelectContent(list));
                    // debugger;
                    (row && row.id) && ncjwUtil.setFiledsValue(self.$officeDialogPanel, {place: row.place});
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getOfficeRoomList: function (row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEROOM_QUERY , JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$officeRoomSel.empty().html(self.getRoomSelectContent(list));
                    (row && row.id) && ncjwUtil.setFiledsValue(self.$officeDialogPanel, {conferenceRoom: row.conferenceRoom});
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    place: {
                        required: true
                    },
                    conferenceRoom: {
                        required: true
                    },
                    conferenceTheme: {
                        required: true,
                        maxlength: 50
                    },
                    startTime: {
                        required: true
                    }
                },
                messages: {
                    place: {
                        required: "请选择办公区"
                    },
                    conferenceRoom: {
                        required: "请选择会议室"
                    },
                    conferenceTheme: {
                        required: "请填写会议主题",
                        maxlength: "最多输入50个字符"
                    },
                    startTime: {
                        required: "请选择时间"
                    },
                    endTime: {
                        required: "请选择时间"
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
                var datas = serializeJSON(data);
                var id = $('#id').val();
                var place = this.$officeAreaSel.val();
                var conferenceRoom = this.$officeRoomSel.val();
                var startTime = Number(this.$startTime.val());
                var conferenceTheme = this.$conferenceTheme.val();
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认'
                        },
                        cancel: {
                            label: '取消'
                        }
                    },
                    title: "预定确认",
                    message: '<div class="tipInfo tipConfirm"><p>' + place + "——" + conferenceRoom + '</p><p>'+ ncjwUtil.timeTurn(startTime) + '至' + ncjwUtil.timeTurn(endTime) + '</p><p>会议主题：' + conferenceTheme + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(id ? QUERY.WORK_MEETING_UPDATE : QUERY.WORK_MEETING_INSERT, datas, function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('预定成功！');
                                    that.$officeDialog.modal('hide');
                                    that.table.refresh();
                                } else {
                                    ncjwUtil.showError("修改失败：" + res.errorMsg);
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