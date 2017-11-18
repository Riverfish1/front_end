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
            storeList: []
        },
        template: _.template(tpl),
        events: {
            'change #storeId': 'handleChange'
        },
        initialize: function () {
        },
        render: function () {
            //main view
            var that = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            };
            ncjwUtil.postData(QUERY.STORE_MNG_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.storeList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            setTimeout(function() {
                that.$el.empty().html(that.template(that.initialData));
                that.table = new BaseTableView();
                that.table.render();
            }, 500);
            return this;
        },
        handleChange: function (e) {
            var value = e.target.value;
            this.table.refresh({
                query: {
                    pageNum: 0,
                    pageSize: 20,
                    storeId: value === '0' ? '' : value
                }
            });
        }
    });
    return View;
});