/*global define*/
define([
    'src/components/workToDo/tableView',
    'text!src/components/workToDo/index.html',
    'text!src/components/workToDo/detail.html'
], function (BaseTableView, tpl, detailTpl) {
    'use strict';
    var TabView = Backbone.View.extend({
        default: {
            items: ["待办事宜", "公文待办", "日常事务"]
        },
        el: '#main',
        template: _.template(tpl),
        getDetailContent: _.template(detailTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
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
            this.table = new BaseTableView();
            this.table.render(index);
        },
        getData: function () {
            var self = this;
            ncjwUtil.getData('/api/workToDo/query', {index: 1}, function (res) {
                // ncjwUtil.getData("/api/del/register/officeArea", {id: row.id}, function (res) {
                if (res.success) {
                    var list = {list: res.data};
                    self.$tabContent.empty().html(self.getDetailContent(list));
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
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
            this.$tabContent = this.$el.find('#tabContent');
            this._selet1stTab();
            this.createDetailView(0);
            return this;
        },
        addOne: function (row) {
            var initData = {areaName: '', areaUsage: ''};
            var row = initData.areaName ? row : initData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
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
                        ncjwUtil.getData("/api/del/register/officeArea", {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo(res.errorMsg);
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
                    appointmentTime: {
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
                    appointmentTime: {
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
                var appointmentTime = Number(this.$appointmentTime.val());
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
                    message: '<div class="tipInfo tipConfirm"><p>' + place + "——" + conferenceRoom + '</p><p>'+ ncjwUtil.timeTurn(appointmentTime) +'</p><p>会议主题：' + conferenceTheme + '</p></div>',
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

    return TabView;
});