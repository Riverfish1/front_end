/*global define*/
define([
    'text!./index.html',
    'text!./detail.html',
    'text!./dialog.html',
    'text!./kpiSelect.html',
    'text!./targetSelect.html',
    '../../common/calendar/calendar',
    '../../common/query/index'
], function (tpl, detailTpl, dialogTpl, kpiSelect, targetSelect, calendar, QUERY) {
    'use strict';
    var TabView = Backbone.View.extend({
        default: {
            items: ["当日","本周", "本月", "本季", "本年"],
            currentDay: new Date().getDate(),
            currentTime: ncjwUtil.getCurrentDate()
        },
        el: '#main',
        template: _.template(tpl),
        getDetailContent: _.template(detailTpl),
        getDialogContent: _.template(dialogTpl),
        getKpiSelectContent: _.template(kpiSelect),
        getTargetNumSelectContent: _.template(targetSelect),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            this.value = 0;
            this._bindEvent();
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            window.ownerPeopleId = 4;
            window.ownerPeopleName = "张三";
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
            // this.$tabContent.empty().html(this.getDetailContent(list));
            // debugger;
            // this.$tabContent.empty().html(this.getDetailContent());
            this.getData(index);
        },
        getData: function (index) {
            var self = this;
            var paramMap = {
                "0": {
                    summaryType: index,
                    gmtCreate: timeUtil.getCurrentDay(),
                    userId: window.ownerPeopleId
                },
                "1": {
                    summaryType: index,
                    startDate: timeUtil.getWeekStartDate(),
                    endDate: timeUtil.getWeekEndDate(),
                    userId: window.ownerPeopleId
                },
                "2": {
                    summaryType: index,
                    startDate: timeUtil.getMonthStartDate(),
                    endDate: timeUtil.getMonthEndDate(),
                    userId: window.ownerPeopleId
                },
                "3": {
                    summaryType: index,
                    startDate: timeUtil.getQuarterStartDate(),
                    endDate: timeUtil.getQuarterEndDate(),
                    userId: window.ownerPeopleId
                },
                "4": {
                    summaryType: index,
                    startDate: timeUtil.getYearStartDate(),
                    endDate: timeUtil.getYearEndDate(),
                    userId: window.ownerPeopleId
                }
            };
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_QUERY, JSON.stringify(paramMap[index]), function (res) {
                if (res.success) {
                    var list = {list: res.data};
                    self.$tabContent.empty().html(self.getDetailContent(list));
                } else {
                    ncjwUtil.showError(res.errorMsg);
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
            this._selet1stTab();
            // this.createDetailView(0);
            return this;
        },
        // 获取关键业务指标下拉列表
        getKpiList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.KPI_ITEM_SELECT, JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$kpiSel.html(self.getKpiSelectContent(list));
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        // 获取目标数值下拉列表
        getTargetNumList: function () {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.TARGET_NUM_ITEMS_SELECT , JSON.stringify(params), function (res) {
                if (res.success) {
                    var list = {list: res.data[0]};
                    self.$targetNumSel.html(self.getTargetNumSelectContent(list));
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        addOne: function (row) {
            // debugger;
            var initData = {id: '', startDate: '', endDate: '', kpiName: '', kpiId: '', targetNumber: '', performance: '', approverId: '', summaryType: '0', operatorId: window.ownerPeopleId, operatorName: window.ownerPeopleName};
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
            this.$kpiSel = this.$editDialogPanel.find('#kpiSel');
            this.$targetNumSel = this.$editDialogPanel.find('#targetNumSel');
            this.getKpiList();
            this.getTargetNumList();
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
                        ncjwUtil.getData(QUERY.WORK_TODO_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo("删除成功");
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
                    eventName: {
                        required: true,
                        maxlength: 50
                    },
                    eventDescription: {
                        required: true,
                        maxlength: 100
                    },
                    completeTime: {
                        required: true
                    }
                },
                messages: {
                    eventName: {
                        required: "请输入标题",
                        maxlength: "最多输入50个字符"
                    },
                    eventDescription: {
                        required: "请输入描述",
                        maxlength: "最多输入100个字符"
                    },
                    completeTime: {
                        required: "请选择时间"
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
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var id = $('#id').val();
                ncjwUtil.postData(QUERY.ASSESS_SUMMARY_INSERT, datas, function (res) {
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
        initSuggest: function () {
            this.$suggestWrap.bsSuggest('init', {
                effectiveFieldsAlias: {peopleName: "姓名", id: "ID", employeeNum: "工号"},
                clearable: true,
                showHeader: true,
                showBtn: false,
                allowNoKeyword: false,
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
            }).on('onUnsetSelectValue', function () {});
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