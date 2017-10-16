/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./view.html',
    '../../common/query/index'
], function (BaseTableView, tpl, viewTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getViewContent: _.template(viewTpl),
        events: {
        },
        initialize: function () {
            Backbone.off('itemPass').on('itemPass', this.changeStatus, this);
            Backbone.off('itemReject').on('itemReject', this.changeStatus, this);
            Backbone.off('itemView').on('itemView', this.viewContent, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$viewContent = this.$el.find('#viewContent');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        viewContent: function (row) {
            row.summaryEndTime = row.summaryEndTime ? ncjwUtil.timeTurn(row.summaryEndTime, 'yyyy.MM.dd') : '';
            row.summaryStartTime = row.summaryStartTime ? ncjwUtil.timeTurn(row.summaryStartTime, 'yyyy.MM.dd') : '';
            this.$viewContent.modal('show');
            this.$viewContent.modal({backdrop: 'static', keyboard: false});
            this.$viewContentPanel = this.$viewContent.find('#editPanel');
            this.$viewContentPanel.empty().html(this.getViewContent(row));
        },
        changeStatus: function(row, type) {
            var p = this;
            var params = {
                id: row.id,
            };
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: '通过'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: '审核' + (type === 'pass' ? '通过' : '驳回'),
                message: '确认' + (type === 'pass' ? '通过' : '驳回') + '吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(type === 'pass' ? QUERY.WORK_SUMMARY_AGREE : QUERY.WORK_SUMMARY_REJECT, JSON.stringify(params), function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('成功' + (type === 'pass' ? '通过！' : '驳回！'));
                                p.table.refresh();
                            } else {
                                ncjwUtil.showInfo('提交失败：' + res.errorMsg);
                            }
                        }, {
                            'contentType': 'application/json'
                        });
                    }
                }
            });
        }
    });
    return View;
});