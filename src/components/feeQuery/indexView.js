/*global define*/
define([
    './tableView',
    'text!./index.html',
    '../../common/query/index'
], function (BaseTableView, tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        events: {
            'click #btn_search': 'query'     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        },
        initialize: function () {
            Backbone.off('itemView').on('itemView', this.addOne, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$searchForm = this.$el.find('#searchForm');
            this.$suggestWrap = this.$searchForm.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
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
        initSearchForm: function () {
            this.$searchForm.validate({
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
        query: function () {
            if (this.$editForm.valid()) {
                var $inputs = this.$searchForm.find('.search-assist');
                var param = {};
                //保存
                $.each($inputs, function (k, el) {
                    var $el = $(el), val = $el.val(), name = $el.attr('name');
                    if(name == "startTime" || name == "endTime"){
                        param[name] = ncjwUtil.parseTimestamp(val);
                    }else{
                        param[name] = val;
                    }
                })
                this.table.refresh(param);
            }
        }
    });
    return View;
});