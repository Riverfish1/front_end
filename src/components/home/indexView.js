define([
	'text!./index.html',
	'../../common/query/index'
], function(indexTpl, QUERY) {
	'use strict';
	var View = Backbone.View.extend({
		el: '#main',
		template: _.template(indexTpl),
		initialize: function() {
			this.$el.empty().html(this.template());
		},
	});
	return View;
});