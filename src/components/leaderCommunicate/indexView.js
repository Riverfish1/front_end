/*global define*/
define([
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {},
        initialize: function () {
            window.ownerPeopleId = 4;
            window.ownerPeopleName = "张三";           
        },
        render: function () {
            //main view
            var initState = {
                people: '张三',
                weekSummary: '目标数值：XXX\n关键业务指标：XXXXXXXXXXXXXXXX\n完成情况：XXX',
                monthSummary: '目标数值：XXX\n关键业务指标：XXXXXXXXXXXXXXXX\n完成情况：XXX',
                quarterlySummary: '目标数值：XXX\n关键业务指标：XXXXXXXXXXXXXXXX\n完成情况：XXX',
                annualSummary: '目标数值：XXX\n关键业务指标：XXXXXXXXXXXXXXXX\n完成情况：XXX'
            };
            this.$el.empty().html(this.template(initState));
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            return this;
        }
    });
    return View;
});