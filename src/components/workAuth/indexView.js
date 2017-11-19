/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'showContent',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm',
            'change #creatorId': 'searchAssignor',
            'change #targetId': 'searchAssignee'
        },
        initialize: function () {
            Backbone.off('itemUpdate').on('itemUpdate', this.showContent, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        showContent: function (row) {
            var initState = {
                targetId: '',
                targetName: '',
                startTime: '',
                endTime: '',
                id: ''
            };
            var row = row.id ? row : initState;
            row.endTime = row.endTime ? ncjwUtil.timeTurn(row.endTime, 'yyyy-MM-dd') : '';
            row.startTime = row.startTime ? ncjwUtil.timeTurn(row.startTime, 'yyyy-MM-dd') : '';
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            $('.startTime,.endTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
            });
            this.$suggestWrap = this.$officeDialogPanel.find('.test');
            this.initSuggest();
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },

        initSuggest: function () {
            var $data = [];
            $.each(this.$suggestWrap, function (k, el) {
                $(el).bsSuggest({
                    /*url: "/rest/sys/getuserlist?keyword=",
                     effectiveFields: ["userName", "email"],
                     searchFields: [ "shortAccount"],
                     effectiveFieldsAlias:{userName: "姓名"},*/
                    effectiveFieldsAlias: {peopleName: "姓名", employeeNum: "工号"},
                    effectiveFields: ['peopleName', 'employeeNum'],
                    clearable: true,
                    showHeader: true,
                    showBtn: false,
                    getDataMethod: 'url',
                    fnAdjustAjaxParam: function(keywords, opts) {
                        return {
                            method: 'post',
                            data: JSON.stringify({
                                peopleName: $(el).val()
                            }),
                            'contentType': 'application/json'
                        };
                    },
                    processData: function(json) {
                        var data = { value: [] };  
                        $.each(json.data && json.data[0], function (i, r) {  
                            data.value.push({ peopleName: $(r.peopleName).length > 0 ? $(r.peopleName).text() : r.peopleName, employeeNum: r.employeeNum, id: r.id })
                        })  
                        return data;  
                    },
                    url: QUERY.FUZZY_QUERY,
                    idField: "id",
                    keyField: "peopleName"
                }).on('onSetSelectValue', function (e, keyword, data) {
                    $(el).siblings('input').val(data.id);
                    $(el).val(data.peopleName);
                });
            })
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
                        ncjwUtil.postData(QUERY.WORK_AUTH_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('取消成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("取消失败：" + res.errorMsg);
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
                    startTime: {
                        required: true
                    },
                    endTime: {
                        required: true,
                        dateRange: ".startTime"
                    },
                    employeeNum: {
                        required: true,
                        number: true
                    }
                },
                messages: {
                    name: "请输入名称",
                    gmtCreate: "请输入时间",
                    startTime: {
                        required: "请选择开始时间"
                    },
                    endTime: {
                        required: "请选择结束时间",
                        dateRange: '起始日期晚于结束日期'
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
                var JSONData = JSON.parse(datas);
                JSONData.creatorName = window.ownerPeopleName;
                JSONData.creatorId = window.ownerPeopleId;
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.WORK_AUTH_UPDATE : QUERY.WORK_AUTH_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '变更成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("提交失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});