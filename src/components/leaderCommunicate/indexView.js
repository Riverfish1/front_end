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
            var params = {
                approverId: 100,
                status: 0
            };
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_QUERY, JSON.stringify(params), function(res) {
                if (res.success) {
                    console.log(res.data[0]);
                }
            }, {
                'contentType': 'application/json'
            });
            this.$el.empty().html(this.template(initState));
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            return this;
        }
    });
    return View;
});