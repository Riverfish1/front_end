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
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
        },
        render: function () {
            //main view
            var that = this;
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
                    var list = res.data ? res.data[0] : [];
                    that.initState.list = list;
                    that.$el.empty().html(that.template(that.initState));
                    $('.evaluate').click(that.evaluate(that));
                } else {
                    that.$el.empty().html(that.template(that.initState));

                }
            }, {
                'contentType': 'application/json'
            });
        },
        evaluate: function (bb) {
            console.log(bb);
            var initData = {evaluation: ''};
            bb.$editDialog.modal('show');
            bb.$editDialog.modal({backdrop: 'static', keyboard: false});
            bb.$editDialogPanel.empty().html(bb.getDialogContent(initData));
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