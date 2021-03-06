/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./receiveDialog.html',
    'text!./scrapDialog.html',
    'text!./maintainDialog.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, tpl, receiveDialog, scrapDialog, maintainDialog, dialogTpl, QUERY) {
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
            assetClassList: [],
        },
        receiveInitialData: {
            assetUsedName: '',
            assetUsedId: '',
            receiveDate: '',
            remark: '',
            assetId: '',
        },
        scrapInitialData: {
            scrapDate: '',
            assetId: '',
            remark: ''
        },
        maintainInitialData: {
            maintainDate: '',
            maintainName: '',
            assetId: '',
            remark: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getMaintainDialogContent: _.template(maintainDialog),
        getReceiveDialogContent: _.template(receiveDialog),
        getScrapDialogContent: _.template(scrapDialog),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #assetSubmitBtn': 'submitForm',
            'click #assetReceiveSubmitBtn': 'receiveSubmitForm',
            'click #assetMaintainSubmitBtn': 'maintainSubmitForm',
            'click #assetScrapSubmitBtn': 'scrapSubmitForm'
        },
        initialize: function () {
            Backbone.off('assetsEdit').on('assetsEdit', this.addOne, this);
            Backbone.off('assetsDelete').on('assetsDelete', this.delOne, this);
            Backbone.off('assetsReceive').on('assetsReceive', this.receiveAsset, this);
            Backbone.off('assetsMaintain').on('assetsMaintain', this.maintainAsset, this);
            Backbone.off('assetsScrap').on('assetsScrap', this.scrapAsset, this);
        },
        receiveAsset: function (row) {
            this.receiveInitialData.assetId = row.id;
            this.$assetsReceiveDialog.modal('show');
            this.$assetsReceiveDialog.modal({backdrop: 'static', keyboard: false});
            this.$assetsReceiveDialogPanel.empty().html(this.getReceiveDialogContent(this.receiveInitialData));
            this.$suggestWrap = this.$assetsReceiveDialogPanel.find('.test');
            this.initSuggest();
            $('.receiveDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$assetReceiveEditForm = this.$assetsReceiveDialog.find('#assetReceiveEditForm');
            this.$assetReceiveEditForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    receiveName: {
                        required: true
                    },
                    receiveDate: {
                        required: true
                    }
                },
                messages: {
                    receiveName: "请输入名称",
                    receiveDate: '请选择领用时间'
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
        receiveSubmitForm: function () {
            if(this.$assetReceiveEditForm.valid()){
                var that = this;
                var data = this.$assetReceiveEditForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                JSONData.receiveOperatorName = window.ownerPeopleName;
                ncjwUtil.postData(QUERY.ASSETS_RECEIVE_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('领用资产成功！');
                        that.$assetsReceiveDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        maintainAsset: function (row) {
            this.maintainInitialData.assetId = row.id;
            this.$assetsMaintainDialog.modal('show');
            this.$assetsMaintainDialog.modal({backdrop: 'static', keyboard: false});
            this.$assetsMaintainDialogPanel.empty().html(this.getMaintainDialogContent(this.maintainInitialData));
            this.$suggestWrap = this.$assetsMaintainDialogPanel.find('.test');
            this.initSuggest();
            $('.maintainDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$assetMaintainEditForm = this.$assetsMaintainDialog.find('#assetMaintainEditForm');
            this.$assetMaintainEditForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    maintainName: {
                        required: true
                    },
                    maintainDate: {
                        required: true
                    },
                    remark: {
                        required: true
                    }
                },
                messages: {
                    maintainName: "请输入名称",
                    maintainDate: '请选择时间',
                    remark: '请输入内容'
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
        maintainSubmitForm: function () {
            if(this.$assetMaintainEditForm.valid()){
                var that = this;
                var data = this.$assetMaintainEditForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                ncjwUtil.postData(QUERY.ASSETS_MAINTAIN_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('已在维修中！');
                        that.$assetsMaintainDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        scrapAsset: function (row) {
            this.scrapInitialData.assetId = row.id;
            this.$assetsScrapDialog.modal('show');
            this.$assetsScrapDialog.modal({backdrop: 'static', keyboard: false});
            this.$assetsScrapDialogPanel.empty().html(this.getScrapDialogContent(this.scrapInitialData));
            this.$suggestWrap = this.$assetsScrapDialogPanel.find('.test');
            this.initSuggest();
            $('.scrapDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$assetScrapEditForm = this.$assetsScrapDialog.find('#assetScrapEditForm');
            this.$assetScrapEditForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    scrapDate: {
                        required: true
                    },
                    remark: {
                        required: true
                    }
                },
                messages: {
                    scrapDate: "请选择时间",
                    remark: '请输入报废原因'
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
        scrapSubmitForm: function () {
            if(this.$assetScrapEditForm.valid()){
                var that = this;
                var data = this.$assetScrapEditForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                ncjwUtil.postData(QUERY.ASSETS_SCRAP_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('报废资产成功！');
                        that.$assetsScrapDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        render: function () {
            var that = this;
            this.$el.empty().html(this.template());
            this.$assetsDialog = this.$el.find('#assetsOne');
            this.$assetsReceiveDialog = this.$el.find('#assetsReceive');
            this.$assetsMaintainDialog = this.$el.find('#assetsMaintain');
            this.$assetsScrapDialog = this.$el.find('#assetsScrap');
            this.$assetsDialogPanel = this.$assetsDialog.find('#editPanel');
            this.$assetsReceiveDialogPanel = this.$assetsReceiveDialog.find('#editPanel');
            this.$assetsMaintainDialogPanel = this.$assetsMaintainDialog.find('#editPanel');
            this.$assetsScrapDialogPanel = this.$assetsScrapDialog.find('#editPanel');
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
                ncjwUtil.setFiledsValue(this.$assetsDialogPanel, {assetDepartmentId: row.assetDepartmentId});
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
                    assetName: {
                        required: true
                    },
                    assetNo: {
                        required: true
                    },
                    assetBuyDate: {
                        required: true
                    },
                    assetUsedName: {
                        required: true
                    },
                    assetDeadline: {
                        required: true,
                        number: true
                    }
                },
                messages: {
                    assetName: "请输入名称",
                    assetNo: '请输入资产编号',
                    assetBuyDate: '请选择购入时间',
                    assetUsedName: '请选择使用人',
                    assetDeadline: {
                        required: '请输入日期',
                        number: '请输入数字'
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
            if(this.$assetEditForm.valid()){
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
        }
    });
    return View;
});