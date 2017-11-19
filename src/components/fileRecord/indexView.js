/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    './upload.js',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, FileUploadView, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            id: '',
            name: '',
            code: '',
            userId: '',
            user: '',
            department: '',
            departmentList: [],
            time: '',
            file: '',
            month: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm',
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemDownload').on('itemDownload', this.downloadFile, this);
        },
        render: function () {
            var that = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            };
            this.$el.empty().html(this.template(this.initialData));
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            ncjwUtil.postData(QUERY.RECORD_DEPARTMENT_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.departmentList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            return this;
        },
        addOne: function (row) {
            var row = row.id ? row : this.initialData;
            if (row.id) {
                row.departmentList = this.initialData.departmentList;
                row.time = ncjwUtil.timeTurn(row.time, 'yyyy-MM-dd');
            }
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            if (row.id) ncjwUtil.setFiledsValue(this.$officeDialogPanel, {department: row.department});
            this.file = new FileUploadView();
            this.$suggestWrap = this.$officeDialogPanel.find('.test');
            this.initSuggest();
            this.$editForm = this.$el.find('#editForm');
            $('.time').datepicker({
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
                            data.value.push({ peopleName: $(r.peopleName).length > 0 ? $(r.peopleName).text() : r.peopleName, employeeNum: r.employeeNum, id: r.id })
                        })  
                        return data;  
                    },
                    url: QUERY.FUZZY_QUERY,
                    idField: "id",
                    keyField: "peopleName"
                }).on('onSetSelectValue', function (e, keyword, data) {
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
                        ncjwUtil.postData(QUERY.ASSETS_FILE_DELETE, {id: row.id}, function (res) {
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
        downloadFile: function (row) {
            var file = row.file;
            if (file) window.open(file);
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    name: {
                        required: true
                    },
                    code: {
                        required: true
                    },
                    user: {
                        required: true
                    },
                    time: {
                        required: true
                    },
                    month: {
                        required: true,
                        number: true
                    }
                },
                messages: {
                    name: "请输入合同名称",
                    code: '请输入合同编号',
                    user: '请选择使用人',
                    time: '请选择购入时间',
                    month: {
                        required: '请输入期限',
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
            if(this.$editForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.ASSETS_FILE_UPDATE : QUERY.ASSETS_FILE_INSERT, datas, function (res) {
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