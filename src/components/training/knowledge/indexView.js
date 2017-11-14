/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./view.html',
    '../../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, viewTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            title: '',
            content: '',
            author: ''
        },
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        getViewContent: _.template(viewTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemView').on('itemView', this.viewDetail, this);
        },
        render: function () {
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.$viewDialog = this.$el.find('#viewDialog');
            this.$viewEditPanel = this.$el.find('#viewEditPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function () {
            var row = this.initialData;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        viewDetail: function (row) {
            if (row.id) row.gmtModified = ncjwUtil.timeTurn(row.gmtModified, 'yyyy-MM-dd hh:mm:ss');
            this.$viewDialog.modal('show');
            this.$viewDialog.modal({backdrop: 'static', keyboard: false});
            this.$viewEditPanel.empty().html(this.getViewContent(row));
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    title: { required: true },
                    content: { required: true },
                    author: { required: true }
                },
                messages: {
                    title: '请输入标题',
                    content: '请输入内容',
                    author: '请输入作者名'
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
                datas = datas.slice(0, -2) + '","operatorId":' + window.ownerPeopleId + datas.slice(-1);
                datas = datas.slice(0, -2) + '","date":' + ncjwUtil.timeTurn(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss') + datas.slice(-1);
                ncjwUtil.postData(QUERY.KNOWLEDGE_INSERT, datas, function (res) {
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