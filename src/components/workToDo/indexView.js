/*global define*/
define([
    'src/components/workToDo/tableView',
    'text!src/components/workToDo/index.html',
    'text!src/components/workToDo/detail.html'
], function (BaseTableView, tpl, detailTpl) {
    'use strict';
    var TabView = Backbone.View.extend({
        default: {
            items: ["待办事宜", "公文待办", "日常事务"]
        },
        el: '#main',
        template: _.template(tpl),
        getDetailContent: _.template(detailTpl),
        initialize: function () {
            this.value = 0;
            this._bindEvent();
        },
        _selet1stTab: function () {
            debugger;
            this.$el.find("a:first").tab('show')
        },
        _bindEvent: function () {
            this.$el.on('shown.bs.tab', $.proxy(this._doShowBSTab, this));
        },
        _doShowBSTab: function (e) {
            debugger;
            var $el = $(e.target);
            if ($el.length > 0) {
                this.value = $el.attr('data-value');
                this.onTabClick(this.value);
            }
        },
        onTabClick: function (index) {
            this.createDetailView(index);
        },
        createDetailView: function (index) {
            this.table = new BaseTableView();
            this.table.render(index);
        },
        getData: function () {
            var self = this;
            ncjwUtil.getData('/api/workToDo/query', {index: 1}, function (res) {
                // ncjwUtil.getData("/api/del/register/officeArea", {id: row.id}, function (res) {
                if (res.success) {
                    var list = {list: res.data};
                    self.$tabContent.empty().html(self.getDetailContent(list));
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
        },
        getValue: function () {
            return this.value;
        },
        getTab: function (witch) {
            this.$el.find('li:eq('+witch+') a').tab('show');
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template(this.default));
            this.$tabContent = this.$el.find('#tabContent');
            this._selet1stTab();
            this.createDetailView(0);
            return this;
        }
    });

    return TabView;
});