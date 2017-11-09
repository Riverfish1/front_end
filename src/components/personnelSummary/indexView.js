/*global define*/
define([
    'text!./index.html',
    'text!./detail.html',
    'text!./comment.html',
    'text!./dialog.html',
    '../../common/calendar/calendar',
    '../../common/query/index'
], function (tpl, detailTpl, commentTpl, dialogTpl, calendar, QUERY) {
    'use strict';
    var TabView = Backbone.View.extend({
        default: {
            items: ["当日", "本周", "本月", "本季", "本年"],
            currentDay: new Date().getDate(),
            currentTime: ncjwUtil.getCurrentDate()
        },
        el: '#main',
        template: _.template(tpl),
        getDetailContent: _.template(detailTpl),
        getCommentContent: _.template(commentTpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm',
            'click #btn_summary': 'addSummary',
            'click .btn-check': 'sendCheck',
            'click .ui-datepicker-body td': 'calendarClick'
        },
        initialize: function () {
            this.value = 0;
            this._bindEvent();
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        _selet1stTab: function () {
            // debugger;
            this.$el.find("a:first").tab('show')
        },
        _bindEvent: function () {
            this.$el.on('shown.bs.tab', $.proxy(this._doShowBSTab, this));
        },
        _doShowBSTab: function (e) {
            // debugger;
            var $el = $(e.target);
            if ($el.length > 0) {
                this.value = $el.attr('data-value');
                this.onTabClick(this.value);
            }
        },
        onTabClick: function (index) {
            this.createDetailView(index);
        },
        createDetailView: function (index) {

            this.getData(index);
            this.showOrHideSummaryBtn(index);
        },
        showOrHideSummaryBtn: function (index) {
            // debugger;
            if (index == 0) {
                this.$summaryBtn.hide();
            } else {
                this.$summaryBtn.show();
            }
            ;
        },
        getData: function (index) {
            var self = this;
            var paramMap = {
                "0": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    operatorId: window.ownerPeopleId
                },
                "1": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    startDate: timeUtil.getWeekStartDate(),
                    endDate: timeUtil.getWeekEndDate(),
                    operatorId: window.ownerPeopleId
                },
                "2": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    startDate: timeUtil.getMonthStartDate(),
                    endDate: timeUtil.getMonthEndDate(),
                    operatorId: window.ownerPeopleId
                },
                "3": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    startDate: timeUtil.getQuarterStartDate(),
                    endDate: timeUtil.getQuarterEndDate(),
                    operatorId: window.ownerPeopleId
                },
                "4": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    startDate: timeUtil.getYearStartDate(),
                    endDate: timeUtil.getYearEndDate(),
                    operatorId: window.ownerPeopleId
                }
            };
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_QUERY_BY_USER_ID, JSON.stringify(paramMap[index]), function (res) {
                if (res.success) {
                    var list = {list: res.data ? res.data[0] : []};
                    self.$tabContent.empty().html(self.getDetailContent(list));
                } else {
                    self.$tabContent.empty().html("暂无数据！");
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getValue: function () {
            return this.value;
        },
        getTab: function (witch) {
            this.$el.find('li:eq(' + witch + ') a').tab('show');
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template(this.default));
            //生成日历
            calendar.init('#calendarWrap');
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            this.$tabContent = this.$el.find('#workSummaryWrap');
            this.$summaryBtn = this.$el.find('#btn_summary');
            this._selet1stTab();
            // this.createDetailView(0);
            return this;
        },
        addOne: function (row) {
            // debugger;
            $('h5.modal-title').text('新增绩效');
            var gmtCreate = ncjwUtil.timeTurn(calendar.getDate(), 'yyyy-MM-dd');
            var initData = {id: '', startDate: '', endDate: '', gmtCreate: gmtCreate, kpiName: '', kpiId: '', targetNumber: '', performance: '', approverId: '', summaryType: '0', operatorId: window.ownerPeopleId, operatorName: window.ownerPeopleName};
            var row = row.id ? row : initData;
            row.completeTime = row.id && ncjwUtil.timeTurn(row.completeTime, 'yyyy-MM-dd');
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row))
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
            this.initSubmitForm();
        },
        addSummary: function (row) {
            // debugger;
            $('h5.modal-title').text('个人总结');
            var index = this.getValue();
            var gmtCreate = ncjwUtil.timeTurn(calendar.getDate(), 'yyyy-MM-dd');
            var commentTimeMap = {
                "1": {startDate: timeUtil.getWeekStartDate(), endDate: timeUtil.getWeekEndDate(), summaryType: 1},
                "2": {startDate: timeUtil.getMonthStartDate(), endDate: timeUtil.getMonthEndDate(), summaryType: 2},
                "3": {startDate: timeUtil.getQuarterStartDate(), endDate: timeUtil.getQuarterEndDate(), summaryType: 3},
                "4": {startDate: timeUtil.getYearStartDate(), endDate: timeUtil.getYearEndDate(), summaryType: 4}
            }
            var initData = {id: '', gmtCreate: gmtCreate, startDate: commentTimeMap[index].startDate, endDate: commentTimeMap[index].endDate, selfEvaluation: '', workSummary: '', kpiName: '', kpiId: '', targetNumber: '', performance: '', approverId: '', summaryType: commentTimeMap[index].summaryType, operatorId: window.ownerPeopleId, operatorName: window.ownerPeopleName};
            var row = row.id ? row : initData;
            row.completeTime = row.id && ncjwUtil.timeTurn(row.completeTime, 'yyyy-MM-dd');
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getCommentContent(row))
            this.$suggestWrap = this.$editDialogPanel.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            row.id && (this.setBssuggestValue(row));
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        sendCheck: function (e) {
            var that = this;
            var $el = $(e.target);
            var param = {id: $el.val(), status: 0};
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_UPDATE, JSON.stringify(param), function (res) {
                if (res.success) {
                    ncjwUtil.showInfo("提交成功");
                    that.createDetailView(that.getValue());
                } else {
                    ncjwUtil.showError("提交失败：" + res.errorMsg);
                }
            }, {
                "contentType": 'application/json'
            })

        },
        calendarClick: function (e) {
            timeUtil.setNow(calendar.getDate());
            this.createDetailView(this.getValue());
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    startDate: {
                        required: true
                    },
                    endDate: {
                        required: true
                        // maxlength: 100
                    },
                    kpiId: {
                        required: true
                    },
                    targetNumber: {
                        required: true
                    },
                    performance: {
                        required: true,
                        maxlength: 100
                    },
                    approverId: {
                        required: true
                    },
                    workSummary: {
                        required: true,
                        maxlength: 100
                    },
                    selfEvaluation: {
                        required: true,
                        maxlength: 100
                    }
                },
                messages: {
                    startDate: {
                        required: "请选择开始时间"
                    },
                    endDate: {
                        required: "请选择结束时间"
                        // maxlength: 100
                    },
                    kpiId: {
                        required: "请选择关键业务指标"
                    },
                    targetNumber: {
                        required: "请选择目标数值"
                    },
                    performance: {
                        required: "请填写完成情况",
                        maxlength: "最多输入100个字符"
                    },
                    approverId: {
                        required: "请选择审批人"
                    },
                    workSummary: {
                        required: "请输入工作总结",
                        maxlength: "最多输入100个字符"
                    },
                    selfEvaluation: {
                        required: "请输入自我评价",
                        maxlength: "最多输入100个字符"
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
            if (this.$editForm.valid()) {
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var id = $('#id').val();
                ncjwUtil.postData(QUERY.ASSESS_SUMMARY_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$editDialog.modal('hide');
                        // that.table.refresh();
                        that.createDetailView(that.getValue());
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        },
        initSuggest: function () {
            this.$suggestWrap.bsSuggest('init', {
                effectiveFieldsAlias: {peopleName: "姓名", id: "ID", employeeNum: "工号"},
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
                var $operatorName = $row.find('input[name=approverName]');
                var $validInput = $row.find('.approverId');
                var $helpBlock = $row.find('.help-block');
                $validInput.val(data.id);
                $operatorName.val(data.peopleName);
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
            // this.$suggestWrap.val(row.approverId);
            this.$suggestWrap.val(row.approverName);
        },
        getCurrentDate: function () {
            var time = new Date().getTime();
            return ncjwUtil.timeTurn(time, 'yyyy-MM-dd') + "&nbsp;&nbsp;&nbsp;&nbsp星期" + "日一二三四五六".charAt(time.getDay())
        }
    });

    return TabView;
});