/*global define*/
define([
    'css!src/components/list/list.css',
    'text!src/components/list/list.html',
], function (css,tpl) {
    'use strict';
    var ListView = Backbone.View.extend({
        el: '#main',
        tagName:  'div',
        template: _.template(tpl),
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template());
            return this;
        }
    });
    return ListView;
});