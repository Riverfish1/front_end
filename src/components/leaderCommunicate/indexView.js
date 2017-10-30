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
            'click .evaluate': 'evaluate',
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
                } else {
                    that.$el.empty().html(that.template(that.initState));
                }
            }, {
                'contentType': 'application/json'
            });
        },
        evaluate: function (e) {
            this.$ele = $(e.target);
            this.$leadDialog = $((this.$ele)[0]).closest('#main').find('#leadDialog');
            var initData = {evaluation: null};
            this.$leadDialog.modal('show');
            this.$leadDialog.modal({backdrop: 'static', keyboard: false});
            this.$leadDialog.find('#editPanel').empty().html(this.getDialogContent(initData));
        },
        submitForm: function () {
            var params = {
                evaluation: $('#evaluation').val(),
                status: '1',
                approverId: window.ownerPeopleId,
                id: $((this.$ele[0])).val()
            };
            var that = this;
            ncjwUtil.postData(QUERY.ASSESS_SUMMARY_UPDATE, JSON.stringify(params), function(res) {
                if (res.success) {
                    ncjwUtil.showInfo('评论成功');
                    setTimeout(function() {window.location.reload();}, 1500);
                    // that.getInitialData();
                }
            }, {
                'contentType': 'application/json'
            });
        }
    });
    return View;
});