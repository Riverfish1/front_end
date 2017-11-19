/*global define*/
define([
    './tableView',
    './detailTableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./detail.html',
    '../../common/query/index'
], function (BaseTableView, DetailTableView, tpl, dialogTpl, detailTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getDetailContent: _.template(detailTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #btn-draft': 'submitForm',
            'click #btn-submit': 'submitForm',
            // 'click #btn-ok': 'submitForm',
            // 'click #btn-no': 'submitForm',
            // 报销明细
            'click #btn_detail_add': 'addDetailOne',
            'click .btn-save': 'createDetailData'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemDetailEdit').on('itemDetailEdit', this.addDetailOne, this);
            Backbone.off('itemDetailDelete').on('itemDetailDelete', this.delDetailOne, this);
            this.detailData = [];
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            this.$detailDialog = this.$el.find('#detailDialog');
            this.$detailDialogPanel = this.$el.find('#detailPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        initSuggest: function () {
            this.$suggestWrap.bsSuggest('init', {
                effectiveFieldsAlias: {peopleName: "姓名", employeeNum: "工号"},
                clearable: true,
                showHeader: true,
                showBtn: false,
                allowNoKeyword: true,
                getDataMethod: "url",
                delayUntilKeyup: true,
                // url: "src/components/sendDocument/data.json",
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
                        data.value.push({peopleName: r.peopleName, employeeNum: r.employeeNum, id: r.id})
                    })
                    return data;
                }
            }).on('onDataRequestSuccess', function (e, result) {
            }).on('onSetSelectValue', function (e, keyword, data) {
                var $row = $(e.target).parents('.input-group')
                var $operatorName = $row.find('input[name=operatorName]');
                var $operatorId = $row.find('input[name=operatorId]');
                var $validInput = $row.find('.operatorId');
                var $helpBlock = $row.find('.help-block');
                $validInput.val(data.id);
                $operatorName.val(data.peopleName);
                $operatorId.val(data.id);
                $helpBlock.remove();
            }).on('onUnsetSelectValue', function () {
            });
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
        setBssuggestValue: function (row) {
            // this.$suggestWrap.val(row.targetId);
            this.$suggestWrap.val(row.operatorName);
        },
        addOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                id: '',
                nodeName: '',
                operatorName: '',
                type: '',
                operatorId: '',
                detailList: [],
                workFlow: {
                    currentNode: {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName, nodeStatus: '0', comment: '', nodeIndex: '0'},
                    nodeList: [
                        {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName},
                        {operatorId: "", nodeName: '领导审批', operatorName: "", comment: ""},
                        {operatorId: "", nodeName: '财务审批', operatorName: "", comment: ""}
                    ]
                },
                status: 'submit'
            };
            var row = row.id ? row : initState;
            if (row.id) {
                // row.workFlow = {
                //     currentNode: {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName, nodeStatus: '0', comment: '', nodeIndex: '0'},
                //     nodeList: [
                //         {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName},
                //         {operatorId: window.ownerPeopleId, nodeName: '审批', operatorName: window.ownerPeopleName},
                //         {operatorId: window.ownerPeopleId, nodeName: '归档', operatorName: window.ownerPeopleName},
                //     ]
                // },
                row.workFlow = row.workflowData.length ? JSON.parse(row.workflowData) : row.workflowData;
                this.detailData = row.workFlow.nodeList;
            } else {
                this.detailData = [];
            }
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row));
            if (row.id) ncjwUtil.setFiledsValue(this.$editDialogPanel, {type: row.type});
            this.$editForm = this.$el.find('#editForm');
            this.$addDetailValid = this.$editForm.find('.addDetailValid');
            this.detailTable = new DetailTableView();
            this.detailTable.render(this.createNodeIndex(this.detailData));
            this.initSubmitForm();
        },
        addDetailOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                id: '',
                nodeName1: '',
                operatorName: '',
                type: '',
                operatorId: '',
                nodeIndex: ''
            };
            var row = row.nodeName ? row : initState;
            if (row.nodeName) {
                row.nodeName1 = row.nodeName;
            }
            this.$detailDialog.modal('show');
            this.$detailDialog.modal({backdrop: 'static', keyboard: false});
            this.$detailDialogPanel.empty().html(this.getDetailContent(row));
            this.$detailForm = this.$el.find('#detailForm');
            this.$suggestWrap = this.$detailForm.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            row.nodeName && (this.setBssuggestValue(row));
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            this.initDetailForm();
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
                        ncjwUtil.postData(QUERY.WORK_WORKFLOW_DELETE, {id: row.id}, function (res) {
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
        delDetailOne: function (row) {
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
                        ncjwUtil.showInfo('删除成功');
                        that.detailData = that.delDetailData(row);
                        that.detailData = that.createNodeIndex(that.detailData);
                        that.detailTable.load(that.detailData);
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
                    nodeName: {
                        required: true
                    },
                    type: {
                        required: true
                    },
                    operator_valid1: {
                        required: true
                    },
                    addDetailValid: {
                        required: true
                    }
                },
                messages: {
                    name: "请填写流程名称",
                    nodeName: "请填写节点名称",
                    type: "请选择流程类型",
                    // reason: "请填写申请理由",
                    operator_valid1: "请选择审批人",
                    addDetailValid: {
                        required: "请添加报销名细"
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
        initDetailForm: function () {
            this.$detailForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    nodeName1: {
                        required: true
                    },
                    type: {
                        required: true
                    },
                    operator_valid: {
                        required: true
                    },
                    addDetailValid: {
                        required: true
                    }
                },
                messages: {
                    nodeName1: "请填写节点名称",
                    type: "请选择流程类型",
                    // reason: "请填写申请理由",
                    operator_valid: "请选择审批人",
                    addDetailValid: {
                        required: "请添加报销名细"
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
            var $btn = $(e.target), $status = $('#status'), index = $btn.attr('data-status');
            //根据点击按钮-修改status隐藏域值；
            var id = $('#id').val();
            var urlMap = {
                "0": id ? QUERY.WORK_WORKFLOW_UPDATE : QUERY.WORK_WORKFLOW_INSERT
                // "1": QUERY.WORK_SENDDOCUMENT_SUBMIT,
                // "1": QUERY.REPAY_CREATE_AGREE,
                // "2": QUERY.REPAY_CREATE_REJECT
            }
            $status.val(index);
            //驳回状态-草稿或提交时，清空反馈意见+审批流程相关数据；
            //已提交状态-通过与驳回，row + 新状态
            if (this.detailData.length > 0) {
                this.$addDetailValid.val(1);
            } else {
                this.$addDetailValid.val("");
            }
            if (this.$editForm.valid()) {
                var that = this;
                var $inputs = that.$editForm.find('.submit-assist');
                var id = $('#id').val();
                //保存
                if (index == 0) {
                    var params = {workFlow: {nodeList: []}, detailList: that.detailData};
                    $.each($inputs, function (k, el) {
                        var $el = $(el), val = $el.val(), name = $el.attr('name');
                        params[name] = val;
                    })
                    params.workFlow.nodeList = that.createNodeIndex(that.getWorkFlow(that.detailData));
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
        createDetailData: function () {
            if (this.$detailForm.valid()) {
                var $inputs = this.$detailForm.find('.detail-assist');
                var nodeIndex = this.$detailForm.find('.nodeIndex').val();
                var obj = {};
                //保存
                $.each($inputs, function (k, el) {
                    var $el = $(el), val = $el.val(), name = $el.attr('name');
                    if (name == "nodeName1") {
                        obj["nodeName"] = val;
                    } else {
                        obj[name] = val;
                    }
                })

                if (nodeIndex) {
                    //更新
                    this.detailData = this.updateDetailData(obj);
                } else {
                    //id自增-新增
                    obj.id = new Date().getTime();
                    this.detailData.push(obj);
                }
                this.detailData = this.createNodeIndex(this.detailData);
                this.$detailDialog.modal('hide');
                this.detailTable.load(this.detailData);
            }
        },
        createNodeIndex: function (d) {
            var arr = [];
            $.each(d, function (k, v) {
                v.nodeIndex = k;
                arr.push(v);
            })
            return arr;
        },
        delDetailData: function (row) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if (row.nodeIndex != v.nodeIndex) {
                    d.push(v);
                }
            })
            return d;
        },
        updateDetailData: function (obj) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if (obj.nodeIndex == v.nodeIndex) {
                    d.push($.extend({}, v, obj));
                } else {
                    d.push(v);
                }
            })
            return d;
        },
        getWorkFlow: function (detailData) {
            var arr = [];
            $.each(detailData, function (k, v) {
                delete v.id;
                arr.push(v);
            })
            return arr;
        }
    });
    return View;
});