/*global define*/
define([
    'css!src/components/list/list.css',
    'text!src/components/list/list.html'
], function (css,tpl) {
    'use strict';
    var ListView = Backbone.View.extend({
        el: '#main',
        tagName:  'div',
        template: _.template(tpl),
        initialize: function(){

        },
        render: function(){
            var self = this;
            this.model.fetch({
                type: 'get',
                data: {
                    account: 'test1',
                    password: 1234
                },
                success: function (res) {
                    if(res){
                        self.$el.html(self.template(self.model.toJSON()));
                    }
                },
            })
            return this;
        }
    });
    return ListView;
});