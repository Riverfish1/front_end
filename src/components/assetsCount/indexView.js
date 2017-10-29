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
                    field: 'assetClassName',
                    title: '资产类别',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'b',
                    title: '闲置',
                    align: 'center',
                    valign: "middle",
                }, {
                    field: 'c',
                    title: '在用',
                    align: 'center',
                    valign: "middle",
                }, {
                    field: 'd',
                    title: '维修',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'e',
                    title: '已报废',
                    align: 'center',
                    valign: "middle",
                }],
                responseHandler: function(res) {
                    var arr = [];
                    var data = res.data && res.data[0];
                    if (data) {
                        $.each(data, function(i, obj) {
                            console.log(obj);
                            var o = {};
                            o.assetClassName = i;
                            $.each(obj, function(key, value) {
                                console.log(key, value);
                                o.b = o.b || (value.status === 0 ? value.count : 0);
                                o.c = o.c || (value.status === 1 ? value.count : 0);
                                o.d = o.d || (value.status === 2 ? value.count : 0);
                                o.e = o.e || (value.status === 3 ? value.count : 0);
                            });
                            console.log(arr);
                            arr.push(o);
                        });
                    }
                    return {
                        "total": res.total,
                        // "rows": res.data ? res.data[0] : []
                        "rows": arr
                    }
                }
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
                    field: 'count',
                    title: '数量',
                    align: 'center',
                    valign: "middle"
                }],
                responseHandler: function(res) {
                    return {
                        "total": res.total,
                        "rows": res.data ? res.data[0] : []
                    }
                }
            });
        }
    });
    return View;
});