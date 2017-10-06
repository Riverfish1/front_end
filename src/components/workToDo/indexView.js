/*global define*/
define([
    'src/components/workToDo/tableView',
    'text!src/components/workToDo/index.html',
    'text!src/components/workToDo/dialog.html'
], function (BaseTableView, tpl, dialogTpl) {
    'use strict';
    var View = Backbone.View.extend({
        default: {
            items: ["待办事宜", "公文待办", "日常事务"]
        },
        el: '#main',
        template: _.template(tpl),
        // getDialogContent: _.template(dialogTpl),
        // events: {
        //     'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        //     'click #submitBtn': 'submitForm'
        // },
        initialize: function () {
            this.value = 0;
            this._bindEvent();
            this._selet1stTab();
            // Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            // Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
        },
        _selet1stTab: function () {
            this.$el.find("a:first").tab('show')
        },
        _bindEvent: function () {
            this.$el.on('shown.bs.tab', $.proxy(this._doShowBSTab, this));
        },
        _doShowBSTab: function (e) {
            var $el = $(e.target);
            if ($el.length > 0) {
                this.value = $el.attr('data-value');
                this.trigger('tab.click', this.value, $el, this.$parent);
            }
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
            return this;
        }
    });
    return View;
});