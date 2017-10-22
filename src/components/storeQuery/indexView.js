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
            warehouse: []
        },
        template: _.template(tpl),
        events: {
        },
        initialize: function () {
        },
        render: function () {
            //main view
            var that = this;
            ncjwUtil.postData(QUERY.STORE_QUERY, {}, function (res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initialData.warehouse = data;
                }
            });
            this.$el.empty().html(this.template(this.initialData));
            this.table = new BaseTableView();
            this.table.render();
            return this;
        }
    });
    return View;
});