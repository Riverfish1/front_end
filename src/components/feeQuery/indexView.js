/*global define*/
define([
    './tableView',
    './detailTableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, DetailTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_search': 'query',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        },
        initialize: function () {
            Backbone.off('itemView').on('itemView', this.addOne, this);
            this.detailData = [];
            this.totalMoney = 0;
            this.totalObj = {};
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$searchForm = this.$el.find('#searchForm');
            this.$suggestWrap = this.$searchForm.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            this.$detailDialog = this.$el.find('#detailDialog');
            this.$detailDialogPanel = this.$el.find('#detailPanel');
            this.initSuggest();
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            $('.accessTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
            });
            this.table = new BaseTableView();
            this.table.render();
            this.initSearchForm();
            return this;
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
                // row.creatorName = "";
                // row.departmentName = "";

                row.departmentId = row.departmentId ? row.departmentId : '';
                row.operatorId = row.operatorId ? row.operatorId : '';
                row.comment = row.comment ? row.comment : '';
                row.workFlow = row.workFlow.length ? JSON.parse(row.workFlow) : row.workFlow;
                row.createTime = ncjwUtil.timeTurn(row.createTime, 'yyyy-MM-dd');
                row.startTime = ncjwUtil.timeTurn(row.startTime, 'yyyy-MM-dd');
                row.endTime = ncjwUtil.timeTurn(row.endTime, 'yyyy-MM-dd');

                row.currentNode = row.workFlow.currentNode.nodeName;
                row.leaderId = row.workFlow.nodeList[0].operatorId;
                row.financerId = row.workFlow.nodeList[1].operatorId;

                this.detailData = row.detail.length ? JSON.parse(row.detail) : row.detail;
                this.getTotalMoney(this.detailData);
                this.detailData = this.detailData.concat([this.totalObj])
            }else {
                this.detailData = [];
                this.totalMoney = 0;
                this.totalObj = {};
            }
            this.showOrhideBtn(row);
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row));
            // this.fileUpload = new FileUploadView();
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
            // this.initSubmitForm();
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
        initSearchForm: function () {
            this.$searchForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    title: {
                        required: true
                    },
                    applyerId: {
                        required: true
                    },
                    startTime: {
                        // required: true
                    },
                    endTime: {
                        // required: true,
                        dateRange: '.startTime'
                    }
                },
                messages: {
                    title: "请填写标题",
                    startTime: "请选择起始日期",
                    endTime: {
                        required: "请选择结束日期",
                        dateRange: '起始日期晚于结束日期'
                    },
                    applyerId: "请选择用户姓名"
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
        query: function () {
            if (this.$searchForm.valid()) {
                var $inputs = this.$searchForm.find('.search-assist');
                var param = {};
                //保存
                $.each($inputs, function (k, el) {
                    var $el = $(el), val = $el.val(), name = $el.attr('name');
                    if(val != ""){
                        if(name == "startTime" || name == "endTime"){
                            param[name] = ncjwUtil.timeTurn(val, 'yyyy-MM-dd');
                        }else{
                            param[name] = val;
                        }
                    }
                })
                this.table.refresh({query: param});
            }
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
        }
    });
    return View;
});