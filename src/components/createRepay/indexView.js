/*global define*/
define([
    './tableView',
    './detailTableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./detail.html',
    './upload',
    '../../common/query/index'
], function (BaseTableView, DetailTableView, tpl, dialogTpl, detailTpl, FileUploadView, QUERY) {
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
            'click #btn-ok': 'submitForm',
            'click #btn-no': 'submitForm',
            // 报销明细
            'click #btn_detail_add': 'addDetailOne',
            'click .btn-save': 'createDetailData',
            //自动计算总天数
            'change .endTime': 'getTotalDay',
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
            $.each(this.$suggestWrap, function (k, el) {
                var $el = $(el),effectiveFieldsAlias = '', url = '', keyField = '', fnAdjustAjaxParam = '', processData = '', onSetSelectValue = '';
                if($el.hasClass('department')){
                    effectiveFieldsAlias = {departmentName: "部门名称", id: "部门ID", parentName: "单位"};
                    url = QUERY.RECORD_DEPARTMENT_QUERY;
                    keyField = "departmentName";
                    fnAdjustAjaxParam = function (keyword, opts) {
                        return {
                            method: 'post',
                            data: JSON.stringify({
                                userPaged: false
                            }),
                            'contentType': 'application/json'
                        };
                    };
                    processData = function (json) {
                        var data = {value: []};
                        $.each(json.data && json.data[0], function (i, r) {
                            data.value.push({departmentName: r.departmentName, parentName: r.parentName, id: r.id})
                        })
                        return data;
                    }
                    onSetSelectValue = function (e, keyword, data) {
                        var $row = $(e.target).parents('.input-group')
                        var $operatorName = $row.find('input[name=departmentName]');
                        var $validInput = $row.find('.departmentIds');
                        var $helpBlock = $row.find('.help-block');
                        $validInput.val(data.id);
                        $operatorName.val(data.departmentName);
                        $helpBlock.remove();
                    }
                }else{
                    effectiveFieldsAlias = {peopleName: "姓名", id: "ID", employeeNum: "工号"};
                    url = QUERY.FUZZY_QUERY;
                    keyField = "peopleName";
                    fnAdjustAjaxParam =  function (keyword, opts) {
                        return {
                            method: 'post',
                            data: JSON.stringify({
                                peopleName: keyword
                            }),
                            'contentType': 'application/json'
                        };
                    };
                    processData = function (json) {
                        var data = {value: []};
                        $.each(json.data && json.data[0], function (i, r) {
                            data.value.push({peopleName: r.peopleName, employeeNum: r.employeeNum, id: r.id})
                        })
                        return data;
                    };
                    onSetSelectValue = function (e, keyword, data) {
                        var $row = $(e.target).parents('.row')
                        var $operatorId = $row.find('input[name=operatorId]');
                        var $operatorName = $row.find('input[name=operatorName]');
                        var $validInput = $row.find('.operatorId');
                        var $helpBlock = $row.find('.help-block');
                        $validInput.val(data.id);
                        $operatorId.val(data.id);
                        $operatorName.val(data.peopleName);
                        $helpBlock.remove();
                    }
                }
                $(el).bsSuggest('init', {
                    effectiveFieldsAlias: effectiveFieldsAlias,
                    clearable: true,
                    showHeader: true,
                    showBtn: false,
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    delayUntilKeyup: true,
                    url: url,
                    idField: "id",
                    keyField: keyField,
                    fnAdjustAjaxParam: fnAdjustAjaxParam,
                    processData: processData
                }).on('onDataRequestSuccess', function (e, result) {
                    // console.log('onDataRequestSuccess: ', result);
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
                    // console.log('onSetSelectValue: ', keyword, data, $validInput.val(data.id), $operatorId.val());
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
                departmentIds: '',
                gmtCreate: ncjwUtil.timeTurn(new Date().getTime(), 'yyyy-MM-dd'),
                startTime: '',
                endTime: '',
                totalDay: 0,
                filePath: '',
                departmentId: window.ownerDepartmentId,
                departmentName: window.ownerDepartmentName,
                creatorId: window.ownerPeopleId,
                creatorName: window.ownerPeopleName,
                currentOperatorId: window.ownerPeopleId,
                currentOperatorName: window.ownerPeopleName,
                role: "current",
                content: "",
                title: "",
                comment: "",
                status: 10,
                workFlow: {
                    currentNode: {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName, nodeStatus: '0', comment: '', nodeIndex: '0'},
                    nodeList: [
                        {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName},
                        {operatorId: "", nodeName: '领导审批', operatorName: ""},
                        {operatorId: "", nodeName: '会签', operatorName: ""},
                        {operatorId: "", nodeName: '审核', operatorName: ""},
                        {operatorId: "", nodeName: '签发', operatorName: ""},
                        {operatorId: "", nodeName: '印发', operatorName: ""},
                        {operatorId: "", nodeName: '归档', operatorName: ""},
                        {operatorId: "", nodeName: '承办', operatorName: ""}
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
            this.fileUpload = new FileUploadView();
            this.$suggestWrap = this.$editDialogPanel.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            row.id && (this.setBssuggestValue(row));
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            $('.accessTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
            });
            this.$editForm = this.$el.find('#editForm');
            this.detailTable = new DetailTableView();
            this.detailTable.render(this.detailData);
            this.initSubmitForm();
        },
        addDetailOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                id : "",
                startTime: "",
                type: "",
                detail: "",
                fee: ""
            };
            var row = row.id ? row : initState;
            if (row.id) {
                row.startTime = ncjwUtil.timeTurn(row.startTime, 'yyyy-MM-dd');
            }
            this.$detailDialog.modal('show');
            this.$detailDialog.modal({backdrop: 'static', keyboard: false});
            this.$detailDialogPanel.empty().html(this.getDetailContent(row));
            this.$detailForm = this.$el.find('#detailForm');
            $('.accessTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
            });
            this.initDetailForm();
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
                    title: {
                        required: true
                    },
                    startTime: {
                        required: true
                    },
                    endTime: {
                        required: true,
                        dateRange: '.startTime'
                    },
                    content: {
                        required: true
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
                    operator_valid4: {
                        required: true
                    },
                    operator_valid5: {
                        required: true
                    },
                    operator_valid6: {
                        required: true
                    },
                    operator_valid7: {
                        required: true
                    },
                    comment: {
                        required: true
                    }
                },
                messages: {
                    title: "请填写标题",
                    startTime: "请选择起始日期",
                    endTime: {
                        required: "请选择结束日期",
                        dateRange: '起始日期晚于结束日期'
                    },
                    content: "请填写正文",
                    operator_valid1: "请选择接收人",
                    operator_valid2: "请选择接收人",
                    operator_valid3: "请选择接收人",
                    operator_valid4: "请选择接收人",
                    operator_valid5: "请选择接收人",
                    operator_valid6: "请选择接收人",
                    operator_valid7: "请选择接收人",
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
        initDetailForm: function () {
            this.$detailForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    title: {
                        required: true
                    },
                    content: {
                        required: true
                    },
                    operator_valid1: {
                        required: true
                    },
                    operator_valid2: {
                        required: true
                    },
                    comment: {
                        required: true
                    }
                },
                messages: {
                    title: "请填写标题",
                    content: "请填写正文",
                    operator_valid1: "请选择接收人",
                    operator_valid2: "请选择接收人",
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
                "0": id ? QUERY.WORK_SENDDOCUMENT_UPDATE : QUERY.WORK_SENDDOCUMENT_NEW,
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
                var comment = $('#comment').val();
                //保存
                if (index == 0 || index == 1) {
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
                    //提交也是创建人；
                    if(index == 1){
                        currentOperatorId = window.ownerPeopleId;
                        comment = "";
                    }
                    var submitParams = {recordId: id, operatorId: currentOperatorId, comment: comment};
                } else {
                    //提交也是创建人；
                    if(index == 1){
                        currentOperatorId = window.ownerPeopleId;
                        comment = "";
                    }
                    var params = {recordId: id, operatorId: currentOperatorId, comment: comment};
                }

                if(index == 1){
                    ncjwUtil.postData(urlMap[0], JSON.stringify(submitParams), function (res) {
                        if (res.success) {
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
        createDetailData: function () {
            if (this.$detailForm.valid()) {
                var $inputs = this.$detailForm.find('.detail-assist');
                var id = this.$detailForm.find('.id').val();
                var obj = {};
                //保存
               $.each($inputs, function (k, el) {
                   var $el = $(el), val = $el.val(), name = $el.attr('name');
                   if(name == "startTime"){
                       obj[name] = ncjwUtil.parseTimestamp(val);
                   }else{
                       obj[name] = val;
                   }
               })

                if(id){
                    //更新
                    this.detailData = this.updateDetailData(obj);
                }else{
                    //id自增-新增
                    obj.id = this.detailData.length + 1;
                    this.detailData.push(obj);
                }
                this.$detailDialog.modal('hide');
                this.detailTable.load(this.detailData);
            }
        },
        delDetailData: function (row) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if(row.id != v.id){
                    d.push(v);
                }
            })
            return d;
        },
        updateDetailData: function (obj) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if(obj.id == v.id){
                    d.push($.extend({}, v, obj));
                }else{
                    d.push(v);
                }
            })
            return d;
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
        },
        isCreater: function (row) {
            return window.ownerPeopleId == row.creatorId;
        },
        isOpertor: function (row) {
            return window.ownerPeopleId == row.currentOperatorId;
        },
        getTotalDay: function (e) {
            var $startTime = this.$editForm.find('.startTime');
            var $endTime = this.$editForm.find('.endTime');
            var $totalDay = this.$editForm.find('.totalDay');
            var stVal = ncjwUtil.parseTimestamp($startTime.val());
            var edVal = ncjwUtil.parseTimestamp($endTime.val());
            if(stVal <= edVal){
                $totalDay.val(ncjwUtil.getDateRange($startTime.val(), $endTime.val()));
            }else{
                $totalDay.val(0);
            }
        }
    });
    return View;
});