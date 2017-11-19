/*global define*/
define([
    'text!./index.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        events: {
            'click #btn-submit': 'submitForm'
        },
        initialize: function () {

        },
        render: function () {
            //main view
            this.initState = {
                assignUserName: '',
                assignUserId: '',
                assignTime: '',
                assignTask: ''
            };
            this.$el.empty().html(this.template(this.initState));
            this.$submitForm = this.$el.find('#submitForm');
            $('#assignTime').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.$suggestWrap = this.$submitForm.find('.test');
            this.initSuggest();
            return this;
        },
        initSuggest: function () {
            var $data = [];
            $.each(this.$suggestWrap, function (k, el) {
                $(el).bsSuggest({
                    /*url: "/rest/sys/getuserlist?keyword=",
                     effectiveFields: ["userName", "email"],
                     searchFields: [ "shortAccount"],
                     effectiveFieldsAlias:{userName: "姓名"},*/
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
                    $('#assignUserId').val(data.id);
                    $('#assignUserName').val(data.peopleName);
                });
            })
        },
        initSubmitForm: function () {
            this.$submitForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    assignTime: {
                        required: true
                    },
                    assignUserName: {
                        required: true
                    },
                    assignTask: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    assignTime: {
                        required: "请选择交办时间"
                    },
                    assignUserName: {
                        required: "请填写交办对象"
                    },
                    assignTask: {
                        equired: "请填写交办任务",
                        maxlength: 50
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorkpiment: function (error, element) {
                    element.parent('div').append(error);
                }
            });
        },
        submitForm: function (e) {
            var self = this;
            this.initSubmitForm();
            if(this.$submitForm.valid()){
                var that = this;
                var data = this.$submitForm.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                datas = datas.slice(0, -2) + '","userId":' + window.ownerPeopleId + datas.slice(-1);
                var assignTime = this.$submitForm.find('#assignTime').val();
                var assignUserName = this.$submitForm.find('#assignUserName').val();
                var assignTask = this.$submitForm.find('#assignTask').val();
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认'
                        },
                        cancel: {
                            label: '取消'
                        }
                    },
                    title: "确认提交？",
                    message: '<div class="tipInfo tipConfirm"><p>' + "交办时间：" + assignTime + '</p><p>交办对象：' + assignUserName + '</p><p>交办任务：' + assignTask + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(QUERY.ASSIGN_MANAGE_INSERT, datas, function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('提交成功！');
                                } else {
                                    ncjwUtil.showError("提交失败：" + res.errorMsg);
                                }
                            }, {
                                "contentType": 'application/json'
                            })
                        }
                    }

                });
            }
        }
    });
    return View;
});