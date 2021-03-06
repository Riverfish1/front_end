/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    'text!./query.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, viewTpl, queryTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            assetName: '',
            id: '',
            assetNo: '',
            assetClassId: '',
            assetBuyDate: '',
            assetUsedId: '',
            assetUsedName: '',
            assetDeadline: '',
            assetClassList: []
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getViewContent: _.template(viewTpl),
        getQueryContent: _.template(queryTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #btn_query': 'showQueryModal',
            'click #assetSubmitBtn': 'submitForm',
            'click #query': 'queryList'
        },
        initialize: function () {
            Backbone.off('assetsEdit').on('assetsEdit', this.addOne, this);
            Backbone.off('assetsDelete').on('assetsDelete', this.delOne, this);
            Backbone.off('assetsView').on('assetsView', this.viewContent, this);
        },
        viewContent: function(row) {
            this.$viewContent.modal('show');
            this.$viewContent.modal({backdrop: 'static', keyboard: false});
            this.$viewContentPanel.empty().html(this.getViewContent(row));
        },
        render: function () {
            var that = this;
            this.$el.empty().html(this.template());
            this.$assetsDialog = this.$el.find('#assetsOne');
            this.$assetsDialogPanel = this.$assetsDialog.find('#editPanel');
            this.$viewContent = this.$el.find('#viewContent');
            this.$viewContentPanel = this.$viewContent.find('#viewPanel');
            this.$advancedQuery = this.$el.find('#advancedQuery');
            this.$queryPanel = this.$advancedQuery.find('#queryPanel');
            this.table = new BaseTableView();
            this.table.render();
            var params = {
                pageNum: 0,
                pageSize: 10000
            };
            ncjwUtil.postData(QUERY.ASSETS_CATEGORY_QUERY, JSON.stringify(params), function(res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.assetClassList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            return this;
        },
        addOne: function (row) {
            var row = row.id ? row : this.initialData;
            row.assetClassList = this.initialData.assetClassList;
            row.assetBuyDate = ncjwUtil.timeTurn(row.assetBuyDate, 'yyyy-MM-dd');
            this.$assetsDialog.modal('show');
            this.$assetsDialog.modal({backdrop: 'static', keyboard: false});
            this.$assetsDialogPanel.empty().html(this.getDialogContent(row));
            if (row.id) {
                ncjwUtil.setFiledsValue(this.$assetsDialogPanel, {assetClassId: row.assetClassId});
            }
            this.$suggestWrap = this.$assetsDialogPanel.find('.test');
            this.initSuggest();
            $('.assetBuyDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$assetEditForm = this.$assetsDialog.find('#assetEditForm');
            this.initSubmitForm();
        },
        showQueryModal: function () {
            this.$advancedQuery.modal('show');
            this.$advancedQuery.modal({backdrop: 'static', keyboard: false});
            this.$queryPanel.empty().html(this.getQueryContent({assetClassList: this.initialData.assetClassList}));
            this.$queryForm = this.$queryPanel.find('#queryForm');
        },
        initSuggest: function () {
            var $data = [];
            $.each(this.$suggestWrap, function (k, el) {
                $(el).bsSuggest({
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
                    keyField: "name"
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
                        ncjwUtil.postData(QUERY.ASSETS_RECORD_DELETE, {id: row.id}, function (res) {
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
            this.$assetEditForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    assetName: { required: true },
                    assetNo: { required: true },
                    assetBuyDate: { required: true },
                    assetUsedName: { required: true },
                    assetDeadline: { required: true }
                },
                messages: {
                    assetName: "请输入名称",
                    assetNo: "请输入编号",
                    assetBuyDate: "请选择日期",
                    assetUsedName: "请选择使用人",
                    assetDeadline: "请输入期限"
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
            if (this.$assetEditForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#assetEditForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.ASSETS_RECORD_UPDATE : QUERY.ASSETS_RECORD_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$assetsDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        queryList: function () {
            var data = this.$queryForm.serialize();
            data = decodeURIComponent(data, true);
            var datas = serializeJSON(data);
            var JSONData = JSON.parse(datas);
            if (!JSONData.assetNo) delete JSONData.assetNo;
            if (!JSONData.assetName) delete JSONData.assetName;
            if (JSONData.assetClassId === 'all') delete JSONData.assetClassId;
            JSONData.pageNum = 0;
            JSONData.pageSize = 10000;
            this.table.refresh({
                query: JSONData
            });
            this.$advancedQuery.modal('hide');
        }
    });
    return View;
});