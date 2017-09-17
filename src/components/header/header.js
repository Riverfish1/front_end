/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/components/header/header.html',
], function ($, _, Backbone, tpl) {
	'use strict';
	var HeaderView = Backbone.View.extend({
        tagName:  'div',
        template: _.template(tpl),
		initialize:function(){

		},
		render:function(){
            this.$el.html(this.template());
			return this;
		}
	});
	return HeaderView;
});