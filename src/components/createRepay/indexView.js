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
            'change .endTime': 'gettotalDays'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemDetailEdit').on('itemDetailEdit', this.addDetailOne, this);
            Backbone.off('itemDetailDelete').on('itemDetailDelete', this.delDetailOne, this);
            this.detailData = [];
            this.totalMoney = 0;
            this.totalObj = {};
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
                var $el = $(el), effectiveFieldsAlias = '', url = '', keyField = '', fnAdjustAjaxParam = '', processData = '', onSetSelectValue = '';
                if ($el.hasClass('department')) {
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
                } else {
                    effectiveFieldsAlias = {peopleName: "姓名", id: "ID", employeeNum: "工号"};
                    url = QUERY.FUZZY_QUERY;
                    keyField = "peopleName";
                    fnAdjustAjaxParam = function (keyword, opts) {
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
                }).on('onSetSelectValue', function (e, keyword, data) {
                    var $row = $(e.target).parents('.row')
                    var $operatorId = $row.find('.suggest-assist-id');
                    var $operatorName = $row.find('.suggest-assist-name');
                    var $validInput = $row.find('.operator_valid');
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
                id: '',
                title: '',
                type: '',
                creatorId: window.ownerPeopleId,
                creatorName: window.ownerPeopleName,
                operatorId: '',
                departmentId: window.ownerDepartmentId,
                departmentName: window.ownerDepartmentName,
                comment: '',
                applyerId: '',
                createTime: ncjwUtil.timeTurn(new Date().getTime(), 'yyyy-MM-dd'),
                acceptTime: ncjwUtil.timeTurn(new Date().getTime(), 'yyyy-MM-dd'),
                startTime: '',
                endTime: '',
                totalDays: 0,
                totalMoney: 0,
                total: 0,
                reason: '',
                filePath: '',
                detailList: [],
                workFlow: {
                    currentNode: {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName, nodeStatus: '0', comment: '', nodeIndex: '0'},
                    nodeList: [
                        {operatorId: window.ownerPeopleId, nodeName: '拟稿', operatorName: window.ownerPeopleName},
                        {operatorId: "", nodeName: '领导审批', operatorName: "", comment: ""},
                        {operatorId: "", nodeName: '财务审批', operatorName: "", comment: ""}
                    ]
                },
                currentNode: "拟稿",
                leaderId: '',
                financerId: '',
                status: 'submit'
            };
            var row = row.id ? row : initState;
            if (row.id) {
                row.departmentId = row.departmentId ? row.departmentId : '';
                row.operatorId = row.operatorId ? row.operatorId : '';
                row.comment = row.comment ? row.comment : '';
                row.workFlow = row.workFlow.length ? JSON.parse(row.workFlow) : row.workFlow;
                row.createTime = ncjwUtil.timeTurn(row.createTime, 'yyyy-MM-dd');
                row.startTime = ncjwUtil.timeTurn(row.startTime, 'yyyy-MM-dd');
                row.endTime = ncjwUtil.timeTurn(row.endTime, 'yyyy-MM-dd');

                row.filePath = '{"filePath":"http://120.55.36.116/static/file/createRepay/20171027085503.jpg","fileName":"150*120.jpg"}@{"filePath":"http://120.55.36.116/static/file/createRepay/20171027085503.png","fileName":"230*230.png"}';
                row.filePath = this.parseFilePath(row.filePath);

                row.currentNode = row.workFlow.currentNode.nodeName;
                row.leaderId = row.workFlow.nodeList[0].operatorId;
                row.financerId = row.workFlow.nodeList[1].operatorId;

                this.detailData = row.detail.length ? JSON.parse(row.detail) : row.detail;
                this.getTotalMoney(this.detailData);
                this.detailData = this.detailData.concat([this.totalObj]);

            }else {
                this.detailData = [];
                this.totalMoney = 0;
                this.totalObj = {};
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
            this.$addDetailValid = this.$editForm.find('.addDetailValid');
            this.detailTable = new DetailTableView();
            this.detailTable.render(this.detailData);
            this.initSubmitForm();
        },
        addDetailOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                id: "",
                time: "",
                type: "",
                description: "",
                money: ""
            };
            var row = row.id ? row : initState;
            if (row.id) {
                row.time = ncjwUtil.timeTurn(row.startTime, 'yyyy-MM-dd');
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
                var name = $(el).parents('.input-group').find('.suggest-assist-name').attr('name');
                var nameMap = {
                    applyerName: row.applyerName
                }
                if(k > 0){
                    nameMap.operatorName = row.workFlow.nodeList[k-1].operatorName;
                }
                $(el).val(nameMap[name]);
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
                        ncjwUtil.postData(QUERY.REPAY_CREATE_DELETE_BY_ID, {id: row.id}, function (res) {
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
                        that.getTotalMoney(that.detailData);
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
                    type: {
                        required: true
                    },
                    startTime: {
                        required: true
                    },
                    endTime: {
                        required: true,
                        dateRange: '.startTime'
                    },
                    // reason: {
                    //     required: true
                    // },

                    filePath: {
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
                    comment: {
                        required: true
                    },
                    addDetailValid: {
                        required: true
                    }
                },
                messages: {
                    title: "请填写标题",
                    type: "请选择报销类型",
                    // reason: "请填写申请理由",
                    startTime: "请选择起始日期",
                    endTime: {
                        required: "请选择结束日期",
                        dateRange: '起始日期晚于结束日期'
                    },
                    operator_valid1: "请选择报销人员",
                    operator_valid2: "请选择审批领导",
                    operator_valid3: "请选择审批财务",
                    comment: "请填写审核意见",
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
                    title: {
                        required: true
                    },
                    time: {
                        required: true
                    },
                    type: {
                        required: true
                    },

                    description: {
                        required: true
                    },
                    money: {
                        required: true,
                        number: true
                    }
                },
                messages: {
                    title: "请填写标题",
                    time: "请填写费用日期",
                    type: "请选择报销类型",
                    description: "请填写使用说明",
                    money: "请填写报销金额"
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
                "0": id ? QUERY.WORK_SENDDOCUMENT_UPDATE : QUERY.REPAY_CREATE_NEW,
                // "1": QUERY.WORK_SENDDOCUMENT_SUBMIT,
                "1": QUERY.REPAY_CREATE_AGREE,
                "2": QUERY.REPAY_CREATE_REJECT
            }
            $status.val(index);
            //驳回状态-草稿或提交时，清空反馈意见+审批流程相关数据；
            //已提交状态-通过与驳回，row + 新状态
            if(this.detailData.length > 0){
                this.$addDetailValid.val(1);
            }else{
                this.$addDetailValid.val("");
            }
            if (this.$editForm.valid()) {
                var that = this;
                var $inputs = that.$editForm.find('.submit-assist');
                var id = $('#id').val();
                // var applyerId = $('.applyerId').val();
                var currentNode = $('#currentNode').val();
                var comment = currentNode == "领导审批" ? $('.leader').val() : $('.financer').val();
                //保存
                if (index == 0) {
                    var params = {workFlow: {nodeList: []}, detailList: that.detailData};
                    $.each($inputs, function (k, el) {
                        var node = {};
                        var $el = $(el), val = $el.val(), name = $el.attr('name');
                        if (name == "operatorId") {
                            node[name] = val;
                            node.operatorName = $el.parents('.row').find('.suggest-assist-name').val();
                            node.nodeName = $el.parents('.row').find('.flow-title').html();
                            params.workFlow.nodeList.push(node);
                            // }else if(name == 'status' || name == "id"){
                        } else if (name == 'status') {

                        } else if (name == 'filePath') {
                            if (val) {
                                params[name] = val.split(',');
                            }
                        } else {
                            params[name] = val;
                        }
                    })
                    params.totalMoney = this.totalMoney;
                    // //提交也是创建人；
                    // if (index == 1) {
                    //     applyerId = window.ownerPeopleId;
                    //     comment = "";
                    // }
                    // var submitParams = {recordId: id, operatorId: applyerId, comment: comment};
                } else {
                    //提交也是创建人；
                    // if (index == 1 || index == 2) {
                    // applyerId = window.ownerPeopleId;
                    // comment = "";
                    // }
                    var params = {recordId: id, operatorId: window.ownerPeopleId, comment: comment};
                }

                // if (index == 1) {
                //     ncjwUtil.postData(urlMap[0], JSON.stringify(submitParams), function (res) {
                //         if (res.success) {
                //             ncjwUtil.postData(urlMap[index], JSON.stringify(params), function (res) {
                //                 if (res.success) {
                //                     ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                //                     that.$editDialog.modal('hide');
                //                     that.table.refresh();
                //                 } else {
                //                     ncjwUtil.showError("保存失败：" + res.errorMsg);
                //                 }
                //             }, {
                //                 "contentType": 'application/json'
                //             })
                //         } else {
                //             ncjwUtil.showError("保存失败：" + res.errorMsg);
                //         }
                //     }, {
                //         "contentType": 'application/json'
                //     })
                // } else {

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
                // }
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
                    if (name == "time") {
                        obj[name] = ncjwUtil.parseTimestamp(val);
                    } else {
                        obj[name] = val;
                    }
                })

                if (id) {
                    //更新
                    this.detailData = this.updateDetailData(obj);
                } else {
                    //id自增-新增
                    obj.id = this.detailData.length + 1;
                    this.detailData.push(obj);
                }
                this.$detailDialog.modal('hide');
                this.getTotalMoney(this.detailData);
                this.detailTable.load(this.detailData.concat([this.totalObj]));
            }
        },
        delDetailData: function (row) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if (row.id != v.id) {
                    d.push(v);
                }
            })
            return d;
        },
        getTotalMoney: function (detailData) {
            var totalMoney = 0;
            $.each(detailData, function (k, v) {
                totalMoney += Number(v.money);
            })
            this.totalMoney = totalMoney < 0 ? 0 : totalMoney;
            this.totalObj = {id: "合计", money: this.totalMoney}
            return this.totalMoney;
        },
        updateDetailData: function (obj) {
            var d = [];
            $.each(this.detailData, function (k, v) {
                if (obj.id == v.id) {
                    d.push($.extend({}, v, obj));
                } else {
                    d.push(v);
                }
            })
            return d;
        },
        showOrhideBtn: function (row) {
            var workFlow = row.workFlow.length ? JSON.parse(row.workFlow) : row.workFlow;
            var nodeList = workFlow.nodeList;
            var currentNodeName = workFlow.currentNode.nodeName;
            var leaderId = nodeList[0].operatorId;
            var financerId = nodeList[1].operatorId;
            var peopleId = window.ownerPeopleId;
            this.$editDialog.find('.status-button').hide();
            // 创建人：新建、草稿、驳回状态显示-草稿与提交按钮
            if(!row.id){
                this.$editDialog.find("#btn-draft").show();
            }else{
                if(((peopleId == leaderId && currentNodeName == "领导审批") || (peopleId == financerId && currentNodeName == "财务审批") ) && row.status == "submit"){
                    this.$editDialog.find("#btn-ok,#btn-no").show();
                }
            }
        },
        gettotalDays: function (e) {
            var $startTime = this.$editForm.find('.startTime');
            var $endTime = this.$editForm.find('.endTime');
            var $totalDays = this.$editForm.find('.totalDays');
            var stVal = ncjwUtil.parseTimestamp($startTime.val());
            var edVal = ncjwUtil.parseTimestamp($endTime.val());
            if (stVal <= edVal) {
                $totalDays.val(ncjwUtil.getDateRange($startTime.val(), $endTime.val()));
            } else {
                $totalDays.val(0);
            }
        },
        parseFilePath: function (filePath) {
            var filePathList = filePath ? filePath.split("@") : [];
            var arr = [];
            $.each(filePathList, function (k, v) {
                var obj = JSON.parse(v);
                arr.push(obj);
            })
            return arr;
        }
    });
    return View;
});