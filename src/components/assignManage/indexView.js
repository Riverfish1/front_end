/*global define*/
define([
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    './tableView',
    '../../common/query/index'
], function (tpl, dialogTpl, viewTpl, BaseTableView, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getViewContent: _.template(viewTpl),
        events: {
            'click #btn_add': 'addOne',
            'click #submitBtn': 'assignForm'
        },
        initialize: function () {
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemView').on('itemView', this.viewContent, this);
        },
        render: function () {
            this.$el.empty().html(this.template());
            this.$dialog = this.$el.find('#dialog');
            this.$dialogPanel = this.$dialog.find('#dialogPanel');
            this.$viewContent = this.$el.find('#viewContent');
            this.$viewContentPanel = this.$viewContent.find('#viewPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function(row) {
            row.assignTime = ncjwUtil.timeTurn(row.assignTime, 'yyyy-MM-dd');
            this.$viewContent.modal('show');
            this.$viewContent.modal({backdrop: 'static', keyboard: false});
            this.$viewContentPanel.empty().html(this.getViewContent(row));
        },
        addOne: function (row) {
            this.$dialog.modal('show');
            this.$dialog.modal({backdrop: 'static', keyboard: false});
            this.$dialogPanel.empty().html(this.getDialogContent());
            $('#assignTime').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$assignForm = this.$dialogPanel.find('#assignForm');
            this.$suggestWrap = this.$assignForm.find('.test');
            this.initSuggest();
            this.$assignForm = this.$dialog.find('#assignForm');
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
                        ncjwUtil.postData(QUERY.ASSIGN_MANAGE_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('删除成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
                            }
                        })
                    }
                }

            });
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
                    $('#assignUserId').val(data.id);
                    $('#assignUserName').val(data.peopleName);
                });
            })
        },
        initSubmitForm: function () {
            this.$assignForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    assignTime: {
                        required: true
                    },
                    assignUserName: {
                        required: true
                    },
                    assignTask: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    assignTime: {
                        required: "请选择交办时间"
                    },
                    assignUserName: {
                        required: "请填写交办对象"
                    },
                    assignTask: {
                        equired: "请填写交办任务",
                        maxlength: 50
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                }
            });
        },
        assignForm: function (e) {
            if(this.$assignForm.valid()){
                var that = this;
                var data = this.$assignForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                datas = datas.slice(0, -2) + '","userId":' + window.ownerPeopleId + datas.slice(-1);
                ncjwUtil.postData(QUERY.ASSIGN_MANAGE_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('提交成功！');
                        that.$dialog.modal('hide');
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