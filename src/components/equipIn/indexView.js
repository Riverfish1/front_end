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
        initialData: {
            storeNo: '',
            storeList: [],
            storeTime: '',
            handlerName: '',
            handleTime: ncjwUtil.timeTurn(new Date().getTime(), 'yyyy-MM-dd'),
            remark: '',
            goodsList: [],
            num: '',
            id: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        render: function () {
            var that = this;
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            var params = {
                pageNum: 0,
                pageSize: 10000
            };
            ncjwUtil.postData(QUERY.STORE_MNG_QUERY, JSON.stringify(params), function(res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.storeList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            ncjwUtil.postData(QUERY.EQUIP_MNG_QUERY, JSON.stringify(params), function(res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.goodsList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            return this;
        },
        addOne: function (row) {
            var row = row.id ? row : this.initialData;
            if (row.id) row.storeList = this.initialData.storeList;
            if (row.id) row.handleTime = ncjwUtil.timeTurn(row.handleTime, 'yyyy-MM-dd');
            if (row.id) row.storeTime = ncjwUtil.timeTurn(row.storeTime, 'yyyy-MM-dd');
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
            this.$suggestWrap = this.$officeDialogPanel.find('.test');
            this.initSuggest();
            this.$editForm = this.$el.find('#editForm');
            $('#storeTime').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
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
                            data.value.push({ peopleName: r.peopleName, employeeNum: r.employeeNum, id: r.id })  
                        })  
                        return data;  
                    },
                    url: QUERY.FUZZY_QUERY,
                    idField: "id",
                    keyField: "name"
                }).on('onSetSelectValue', function (e, keyword, data) {
                    $('#handlerId').val(data.id);
                    $('#handlerName').val(data.peopleName);
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
                        ncjwUtil.postData(QUERY.EQUIP_IN_DELETE, {id: row.id}, function (res) {
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
                    storeNo: { required: true },
                    handlerName: { required: true },
                    num: { required: true },
                    storeTime: { required: true }
                },
                messages: {
                    storeNo: "请输入入库单号",
                    handlerName: "请选择经办人",
                    num: "请输入数量",
                    storeTime: "请选择日期"
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
                JSONData.creatorId = window.ownerPeopleId;
                JSONData.handleTime = this.initialData.handleTime;
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.EQUIP_IN_UPDATE : QUERY.EQUIP_IN_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        if (res.data && !res.data[0]) {
                            ncjwUtil.showError(res.tips);
                            return;
                        }
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
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