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
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #btn-draft': 'submitForm',
            'click #btn-submit': 'submitForm',
            'click #btn-ok': 'submitForm',
            'click #btn-no': 'submitForm'
        },
        initialize: function () {
            window.ownerPeopleId = 5;
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },

        initSuggest: function () {
            $.each(this.$suggestWrap, function (k, el) {
                $(el).bsSuggest('init', {
                    /*url: "/rest/sys/getuserlist?keyword=",
                     effectiveFields: ["userName", "email"],
                     searchFields: [ "shortAccount"],
                     effectiveFieldsAlias:{userName: "姓名"},*/
                    effectiveFieldsAlias:{userName: "姓名", userId: "ID", number: "工号"},
                    clearable: true,
                    showHeader: true,
                    showBtn: false,
                    url: "src/components/sendDocument/data.json",
                    idField: "userId",
                    keyField: "userName"
                }).on('onDataRequestSuccess', function (e, result) {
                    console.log('onDataRequestSuccess: ', result);
                }).on('onSetSelectValue', function (e, keyword, data) {
                    var $operatorId = $(e.target).parents('.row').find('input[name=operatorId]');
                    $operatorId.val(data.userId);
                    console.log('onSetSelectValue: ', keyword, data, $operatorId.val());
                }).on('onUnsetSelectValue', function () {
                    console.log('onUnsetSelectValue');
                });
            })
        },
        initBtnEvent: function () {
            var method = $(this).text();
            var $i;

            if (method === 'init') {
                this.initSuggest();
            } else {
                $i = this.$suggestWrap.bsSuggest(method);
                if (typeof $i === 'object') {
                    $i = $i.data('bsSuggest');
                }
                console.log(method, $i);
                if (!$i) {
                    alert('未初始化或已销毁');
                }
            }

            if (method === 'version') {
                alert($i);
            }
        },
        addOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                creatorId: 5,
                currentOperatorId: 2,
                creatorName: "张建军",
                role: "current",
                content: "",
                title: "",
                comment: "",
                status: 10,
                workFlow: {
                    currentNode: {operatorId: window.ownerPeopleId, nodeName: '拟稿', nodeStatus: '0', comment: '', nodeIndex: '0'},
                    nodeList: [
                        {operatorId: window.ownerPeopleId, nodeName: '拟稿'},
                        {operatorId: "", nodeName: '领导审批'},
                        {operatorId: "", nodeName: '会签'},
                        {operatorId: "", nodeName: '审核'},
                        {operatorId: "", nodeName: '签发'},
                        {operatorId: "", nodeName: '印发'},
                        {operatorId: "", nodeName: '归档'},
                        {operatorId: "", nodeName: '承办'}
                    ]
                },
                id: ''

            };
            var row = row.id ? row : initState;
            if(row.id){
                row.workFlow = JSON.parse(row.workflowData);
            }
            console.log("row", row);
            this.showOrhideBtn(row);
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row));
            this.$suggestWrap = this.$editDialogPanel.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
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
                        ncjwUtil.postData(QUERY.WORK_SENDDOCUMENT_DELETE, {id: row.id}, function (res) {
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
                    name: {
                        required: true
                    },

                    gmtCreate: {
                        required: true
                    }
                },
                messages: {
                    name: "请输入名称",
                    gmtCreate: "请输入时间"
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
            var $btn = $(e.target), $status = $('#status'), index = $btn.attr('data-status');
            //根据点击按钮-修改status隐藏域值；
            var urlMap = {
                "0": QUERY.WORK_SENDDOCUMENT_NEW,
                "1": QUERY.WORK_SENDDOCUMENT_SUBMIT,
                "2": QUERY.WORK_SENDDOCUMENT_AGREE,
                "3": QUERY.WORK_SENDDOCUMENT_REJECT
            }
            $status.val(index);
            //驳回状态-草稿或提交时，清空反馈意见+审批流程相关数据；
            //已提交状态-通过与驳回，row + 新状态
            if (this.$editForm.valid()) {
                var that = this;
                var $inputs = that.$editForm.find('.submit-assist');
                var id = $('#id').val();
                var currentOperatorId = $('#currentOperatorId').val();
                //保存
                if(index == 0){
                    var params = {workFlow:{nodeList: []}};
                    $.each($inputs, function (k, el) {
                        var node = {};
                        var $el = $(el), val = $el.val(), name = $el.attr('name');
                        if(name == "operatorId"){
                            node[name] = val;
                            node.nodeName = $el.parents('.row').find('.flow-title').html();
                            params.workFlow.nodeList.push(node);
                            // }else if(name == 'status' || name == "id"){
                        }else if(name == 'status' || name == "id"){

                        }else{
                            params[name] = val;
                        }
                    })
                }else{
                    var params = {recordId: id, operatorId: currentOperatorId, comment: ""};
                }

                ncjwUtil.postData(urlMap[index], JSON.stringify(params), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$editDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        showOrhideBtn: function (row) {
            // this.$editDialog.find('.status-button').hide();
            // // 创建人：新建、草稿、驳回状态显示-草稿与提交按钮
            // if(this.isCreater(row) && (row.status == 10 || row.status == 0)){
            //     this.$editDialog.find("#btn-draft,#btn-submit").show();
            // }
            // // 处理人：已提交状态显示-通过与驳回按钮
            // if(this.isOpertor(row) && (row.status == 1)){
            //     this.$editDialog.find("#btn-ok,#btn-on").show();
            // }
            this.$editDialog.find('.status-button').hide();
            if(this.isCreater(row)){
               if(row.role == "current"){
                    this.$editDialog.find("#btn-draft,#btn-submit").show();
               }
            }else{
                 if(row.role == "current"){
                    this.$editDialog.find("#btn-ok,#btn-on").show();
                }
            }
        },
        isCreater: function (row) {
            return window.ownerPeopleId == row.creatorId;
        },
        isOpertor: function (row) {
            return window.ownerPeopleId == row.opertorId;
        }
    });
    return View;
});