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
            'click #category': 'queryByCate',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #department': 'queryByDep'
        },
        initialize: function () {
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
        queryByCate: function (e, el) {
            console.log(e, el);
            e.preventDefault();
            this.table.bootstrapTable('refresh', {
                queryParams: function (params) {
                    return {
                        pageNum: params.offset / params.limit,
                        pageSize: params.limit,
                        status: 1
                    }
                }
            });
        },
        queryByDep: function (e) {
            e.preventDefault();
        }
    });
    return View;
});