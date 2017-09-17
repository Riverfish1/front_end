/*global define*/
define([
    'src/components/header/header',
	'src/components/footer/footer',
	'src/components/sidebar/nav-sidebar',
    'css!src/components/app/app.css'
], function (HeaderView, FooterView, NavSideBar) {
	'use strict';

	var AppView = Backbone.View.extend({

		el: '#app',

		initialize: function () {
			this.$header = $('#header');
			this.$footer = $('#footer');
			this.$sidebar = $('#sidebar');
			this.headerView = new HeaderView();
			this.footerView = new FooterView();
			this.navSideBarView = new NavSideBar();
			this.render();
		},

		render: function () {
            this.$header.html(this.headerView.render().el);
            this.$footer.html(this.footerView.render().el);
            this.$sidebar.html(this.navSideBarView.render().el);
			return this;
		}
	});

	return AppView;
});
