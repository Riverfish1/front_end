/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            police: '',
            trainType: '',
            trainUnits: '',
            trainAddr: '',
            trainStartTime: '',
            trainEndTime: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        render: function () {
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function () {
            var row = this.initialData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            $('.trainStartTime, .trainEndTime').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true
            });
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    police: { required: true },
                    trainAddr: { required: true },
                    trainUnits: { required: true },
                    trainType: { required: true },
                    trainStartTime: { required: true },
                    trainEndTime: { required: true, dateRange: '.trainStartTime' }
                },
                messages: {
                    police: '请输入警员',
                    trainAddr: '请输入培训地址',
                    trainUnits: '请输入培训单位',
                    trainType: '请输入培训类型',
                    trainStartTime: '请选择培训开始时间',
                    trainEndTime: { required: '请选择培训结束时间', dateRange: '结束时间必须大于开始时间' }
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
            if(this.$editForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                JSONData.operatorId = window.ownerPeopleId;
                ncjwUtil.postData(QUERY.CULTIVATION_INSERT, JSON.stringify(JSONData), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("提交失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});