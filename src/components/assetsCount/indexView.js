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
            'click #assetClass': 'queryByCate',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #department': 'queryByDep'
        },
        initialize: function () {
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        queryByCate: function (e) {
            e.preventDefault();
            $(e.target).removeClass('btn-default').addClass('btn-primary');
            $(e.target).siblings().removeClass('btn-primary').addClass('btn-default');
            this.table.refreshOptions({
                url: QUERY.ASSETS_RECORD_QUERY_BY_ASSET_CLASS,
                columns: [{
                    field: 'assetClass',
                    title: '资产类别',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'a',
                    title: '在用',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'b',
                    title: '闲置',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'c',
                    title: '借出',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'd',
                    title: '已报废',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'e',
                    title: '合计',
                    align: 'center',
                    valign: "middle"
                }]
            });
        },
        queryByDep: function (e) {
            $(e.target).siblings().removeClass('btn-primary').addClass('btn-default');
            $(e.target).removeClass('btn-default').addClass('btn-primary');
            e.preventDefault();
            this.table.refreshOptions({
                url: QUERY.ASSETS_RECORD_QUERY_BY_DEPARTMENT,
                columns: [{
                    field: 'departmentName',
                    title: '部门',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'a',
                    title: '在用',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'b',
                    title: '闲置',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'c',
                    title: '借出',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'd',
                    title: '已报废',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'e',
                    title: '合计',
                    align: 'center',
                    valign: "middle"
                }]
            });
        }
    });
    return View;
});