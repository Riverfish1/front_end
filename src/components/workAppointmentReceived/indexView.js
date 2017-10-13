/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
        },
        initialize: function () {
            Backbone.off('itemView').on('itemView', this.viewContent, this);
            Backbone.off('itemPass').on('itemPass', this.changeStatus, this);
            Backbone.off('itemReject').on('itemReject', this.changeStatus, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function (row) {
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            row.startTime = ncjwUtil.timeTurn(row.startTime);
            row.endTime = ncjwUtil.timeTurn(row.endTime);
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
        },
        changeStatus: function (row, type) {
            var that = this;
            var params = {
                id: row.id,
                status: type === 'pass' ? '1' : '2'
            };
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: type === 'pass' ? '通过' : '驳回'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: type === 'pass' ? '通过' : '驳回',
                message: '确定要' + (type === 'pass' ? '通过' : '驳回') + '吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.WORK_APPOINTMENT_UPDATE, JSON.stringify(params), function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('提交成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("提交失败：" + res.errorMsg);
                            }
                        }, {
                            'contentType': 'application/json'
                        })
                    }
                }

            });
        }
    });
    return View;
});