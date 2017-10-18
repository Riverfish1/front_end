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
            this.$el.empty().html(this.template());
            return this;
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
            this.initSubmitForm();
            if(this.$submitForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                console.log(data);
                var datas = serializeJSON(data);
                console.log(datas);
                var JSONData = JSON.parse(datas);
                var id = $('#id').val();
                var assignTime = this.$assignTime.val();
                var assignUserName = this.$assignUserName.val();
                var assignTask = this.$assignTask.val();
                bootbox.confirm({
                    buttons: {
                        confirm: {
                            label: '确认'
                        },
                        cancel: {
                            label: '取消'
                        }
                    },
                    title: "确认设定",
                    message: '<div class="tipInfo tipConfirm"><p>' + "交办时间" + assignTime + '</p><p>交办对象：' + assignUserName + '</p><p>交办任务：' + assignTask + '</p></div>',
                    callback: function (result) {
                        if (result) {
                            ncjwUtil.postData(QUERY.ASSIGN_MANAGE_INSERT, JSON.stringify(JSONData), function (res) {
                                if (res.success) {
                                    ncjwUtil.showInfo('设定成功！');
                                } else {
                                    ncjwUtil.showError("设定失败：" + res.errorMsg);
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