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
            'click #submit': 'handleSubmit'
        },
        initialize: function () {
        },
        render: function () {
            this.$el.empty().html(this.template(this.initialData));
            $('.assetExpireDate').datepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        handleSubmit: function () {
            var date = $('#toolbar').find('.assetExpireDate').val();
            this.table.refresh({
                query: {
                    pageNum: 0,
                    pageSize: 20,
                    assetExpireDate: date
                }
            });
        }
    });
    return View;
});