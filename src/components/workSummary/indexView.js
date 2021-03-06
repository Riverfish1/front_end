/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, viewTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getViewContent: _.template(viewTpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'showContent',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.showContent, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemView').on('itemView', this.viewContent, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$viewContent = this.$el.find('#viewContent');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function (row) {
            row.summaryEndTime = row.summaryEndTime ? ncjwUtil.timeTurn(row.summaryEndTime, 'yyyy-MM-dd') : '';
            row.summaryStartTime = row.summaryStartTime ? ncjwUtil.timeTurn(row.summaryStartTime, 'yyyy-MM-dd') : '';
            this.$viewContent.modal('show');
            this.$viewContent.modal({backdrop: 'static', keyboard: false});
            this.$viewContentPanel = this.$viewContent.find('#editPanel');
            this.$viewContentPanel.empty().html(this.getViewContent(row));
        },
        showContent: function (row) {
            var initState = {
                leaderName: '',
                leaderId: '',
                summaryContent: '',
                summaryStartTime: '',
                summaryEndTime: '',
                summaryTitle: '',
                id: ''
            };
            var row = row.id ? row : initState;
            row.summaryEndTime = row.summaryEndTime ? ncjwUtil.timeTurn(row.summaryEndTime, 'yyyy-MM-dd') : '';
            row.summaryStartTime = row.summaryStartTime ? ncjwUtil.timeTurn(row.summaryStartTime, 'yyyy-MM-dd') : '';
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            $('.startDate,.endDate').datepicker({
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
                    keyField: "leaderName"
                }).on('onSetSelectValue', function (e, keyword, data) {
                    $(el).val(data.peopleName);
                    $(el).next('input').val(data.id);
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
                        ncjwUtil.postData(QUERY.WORK_SUMMARY_DELETE, {id: row.id}, function (res) {
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
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    summaryStartTime: {
                        required: true
                    },
                    summaryEndTime: {
                        required: true,
                        dateRange: '.startDate'
                    },
                    summaryTitle: {
                        required: true
                    },
                    summaryContent: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    summaryStartTime: "请选择开始时间",
                    summaryEndTime: {
                        required: "请选择结束时间",
                        dateRange: '起始日期晚于结束日期'
                    },
                    summaryTitle: '请输入标题',
                    summaryContent: {
                        required: "请输入内容",
                        maxlength: "最多输入1000个字符"
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
                datas = datas.replace(/\+/g, ' ');
                datas = datas.slice(0, -2) + '","peopleId":' + window.ownerPeopleId + datas.slice(-1);
                // var JSONData = JSON.parse(datas);
                // JSONData.peopleId = window.ownerPeopleId;
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.WORK_SUMMARY_UPDATE : QUERY.WORK_SUMMARY_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});