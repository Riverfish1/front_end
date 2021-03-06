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
                    effectiveFieldsAlias: {peopleName: "姓名", employeeNum: "工号"},
                    clearable: true,
                    showHeader: true,
                    showBtn: false,
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    delayUntilKeyup: true,
                    // url: "src/components/REQUESTDOCUMENT/data.json",
                    url: QUERY.FUZZY_QUERY,
                    idField: "id",
                    keyField: "peopleName",
                    fnAdjustAjaxParam: function (keyword, opts) {
                        return {
                            method: 'post',
                            data: JSON.stringify({
                                peopleName: keyword
                            }),
                            'contentType': 'application/json'
                        };
                    },
                    processData: function (json) {
                        var data = {value: []};
                        $.each(json.data && json.data[0], function (i, r) {
                            data.value.push({peopleName: $(r.peopleName).length > 0 ? $(r.peopleName).text() : r.peopleName, employeeNum: r.employeeNum, id: r.id})
                        })
                        return data;
                    }
                }).on('onDataRequestSuccess', function (e, result) {
                }).on('onSetSelectValue', function (e, keyword, data) {
                    var $row = $(e.target).parents('.row')
                    var $operatorId = $row.find('input[name=operatorId]');
                    var $operatorName = $row.find('input[name=operatorName]');
                    var $validInput = $row.find('.operatorId');
                    var $helpBlock = $row.find('.help-block');
                    $validInput.val(data.id);
                    $operatorId.val(data.id);
                    $operatorName.val(data.peopleName);
                    $helpBlock.remove();
                }).on('onUnsetSelectValue', function () {
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
                creatorId: window.ownerPeopleId,
                creatorName: window.ownerPeopleName,
                currentOperatorId: window.ownerPeopleId,
                currentOperatorName: window.ownerPeopleName,
                role: "current",
                extension: "0",
                content: "",
                title: "",
                comment: "",
                status: 10,
                workFlow: {
                    currentNode: {operatorId: window.ownerPeopleId, nodeName: '发起人', operatorName: window.ownerPeopleName, nodeStatus: '0', comment: '', nodeIndex: '0'},
                    nodeList: [
                        {operatorId: window.ownerPeopleId, nodeName: '发起人', operatorName: window.ownerPeopleName},
                        {operatorId: "", nodeName: '部门签署', operatorName: ""},
                        {operatorId: "", nodeName: '办公室签署', operatorName: ""},
                        {operatorId: "", nodeName: '领导批示', operatorName: ""}
                    ]
                },
                id: ''

            };
            var row = row.id ? row : initState;
            if (row.id) {
                row.workFlow = JSON.parse(row.workflowData);
                row.gmtCreate = ncjwUtil.timeTurn(row.gmtCreate);
            }
            this.showOrhideBtn(row);
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row));
            this.$suggestWrap = this.$editDialogPanel.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            row.id && (this.setBssuggestValue(row));
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        setBssuggestValue: function (row) {
            $.each(this.$suggestWrap, function (k, el) {
                $(el).val(row.workFlow.nodeList[k].operatorName);
            });
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
                        ncjwUtil.postData(QUERY.WORK_REQUESTDOCUMENT_DELETE, {id: row.id}, function (res) {
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
                    title: {
                        required: true,
                        maxlength: 100
                    },
                    content: {
                        required: true,
                        maxlength: 100
                    },
                    operator_valid1: {
                        required: true
                    },
                    operator_valid2: {
                        required: true
                    },
                    operator_valid3: {
                        required: true
                    },
                    comment: {
                        required: true
                    }
                },
                messages: {
                    title: {
                        required: "请填写标题",
                        maxlength: "最多输入100个字符"
                    },
                    content: {
                        required: "请填写正文",
                        maxlength: "最多输入100个字符"
                    },
                    operator_valid1: "请选择接收人",
                    operator_valid2: "请选择接收人",
                    operator_valid3: "请选择接收人",
                    comment: "请填写审核意见"
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
            var id = $('#id').val();
            var urlMap = {
                "0": id ? QUERY.WORK_REQUESTDOCUMENT_UPDATE : QUERY.WORK_REQUESTDOCUMENT_NEW,
                "1": QUERY.WORK_REQUESTDOCUMENT_SUBMIT,
                "2": QUERY.WORK_REQUESTDOCUMENT_AGREE,
                "3": QUERY.WORK_REQUESTDOCUMENT_REJECT
            }
            $status.val(index);
            //驳回状态-草稿或提交时，清空反馈意见+审批流程相关数据；
            //已提交状态-通过与驳回，row + 新状态
            if (this.$editForm.valid()) {
                var that = this;
                var $inputs = that.$editForm.find('.submit-assist');
                var id = $('#id').val();
                var currentOperatorId = $('#currentOperatorId').val();
                var comment = $('#comment').val();
                //保存
                if (index == 0|| index == 1) {
                    var params = {workFlow: {nodeList: []}};
                    $.each($inputs, function (k, el) {
                        var node = {};
                        var $el = $(el), val = $el.val(), name = $el.attr('name');
                        if (name == "operatorId") {
                            node[name] = val;
                            node.operatorName = $el.parents('.row').find('input[name=operatorName]').val();
                            node.nodeName = $el.parents('.row').find('.flow-title').html();
                            params.workFlow.nodeList.push(node);
                            // }else if(name == 'status' || name == "id"){
                        } else if (name == 'status') {

                        } else {
                            params[name] = val;
                        }
                    })
                } else {
                    var params = {recordId: id, operatorId: currentOperatorId, comment: comment};
                }

                if(index == 1){
                    ncjwUtil.postData(urlMap[0], JSON.stringify(params), function (res) {
                        if (res.success) {
                            //提交也是创建人；
                            if(index == 1){
                                currentOperatorId = window.ownerPeopleId;
                                comment = "";
                            }
                            var submitParams = {recordId: id || res.data[0], operatorId: currentOperatorId, comment: comment};
                            ncjwUtil.postData(urlMap[index], JSON.stringify(submitParams), function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('提交成功！');
                                    that.$editDialog.modal('hide');
                                    that.table.refresh();
                                } else {
                                    ncjwUtil.showError("保存失败：" + res.errorMsg);
                                }
                            }, {
                                "contentType": 'application/json'
                            })
                        } else {
                            ncjwUtil.showError("保存失败：" + res.errorMsg);
                        }
                    }, {
                        "contentType": 'application/json'
                    })
                }else{
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
            }
        },
        showOrhideBtn: function (row) {
            this.$editDialog.find('.status-button').hide();
            // 创建人：新建、草稿、驳回状态显示-草稿与提交按钮
            if (this.isCreater(row) && (row.workFlow.currentNode.nodeIndex == 0)) {
                this.$editDialog.find("#btn-draft,#btn-submit").show();
            }
            // 处理人：已提交状态显示-通过与驳回按钮
            if (this.isOpertor(row) && (row.workFlow.currentNode.nodeIndex != 0)) {
                this.$editDialog.find("#btn-ok,#btn-no").show();
            }
            // this.$editDialog.find('.status-button').hide();
            // if(this.isCreater(row)){
            //    if(row.role == "current"){
            //         this.$editDialog.find("#btn-draft,#btn-submit").show();
            //    }
            // }else{
            //      if(row.role == "current"){
            //         this.$editDialog.find("#btn-ok,#btn-on").show();
            //     }
            // }
        },
        isCreater: function (row) {
            return window.ownerPeopleId == row.creatorId;
        },
        isOpertor: function (row) {
            return window.ownerPeopleId == row.currentOperatorId;
        }
    });
    return View;
});