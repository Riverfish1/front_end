/*global define*/
define([
    './tableView',
    'text!./index.html',
    '../../common/query/index'
], function (BaseTableView, tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initialData: {
            assetClass: ''
        },
        template: _.template(tpl),
        events: {
        },
        initialize: function () {
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        render: function () {
            this.$el.empty().html(this.template(this.initialData));
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        delOne: function (row) {
            var that = this;
            var params = {
                id: row.id,
                assetId: row.assetId,
                status: 1
            };
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
                message: '确定退库吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.ASSETS_RECEIVE_UPDATE, JSON.stringify(params), function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('退库成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("退库失败：" + res.errorMsg);
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