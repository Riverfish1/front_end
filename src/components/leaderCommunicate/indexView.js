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
        events: {
            'click #evaluate': 'evaluate',
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('submitForm').on('submitForm');
        },
        render: function () {
            //main view
            this.initState = {
                list: []
            };
            this.getInitialData();
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            return this;
        },
        getInitialData: function () {
            var that = this;
            var params = {
                approverId: window.ownerPeopleId,
                status: '0'
            };
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_QUERY, JSON.stringify(params), function(res) {
                if (res.success) {
                    var list = res.data && res.data[0];
                    that.initState.list = list;
                    that.$el.empty().html(that.template(that.initState));
                } else {
                    that.$el.empty().html(that.template(that.initState));

                }
            }, {
                'contentType': 'application/json'
            });
        },
        evaluate: function () {
            var initData = {evaluation: ''};
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(initData));
        },
        submitForm: function () {
            var params = {
                evaluation: $('#evaluation').val(),
                status: '1',
                approverId: window.ownerPeopleId
            };
            var that = this;
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_UPDATE, JSON.stringify(params), function(res) {
                if (res.success) {
                    that.getInitialData();
                }
            }, {
                'contentType': 'application/json'
            });
        }
    });
    return View;
});