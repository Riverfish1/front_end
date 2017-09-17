/* global require */

'use strict';

(function () {
	//配置baseUrl
	var baseUrl = document.getElementById('baseUrl').getAttribute('data-baseurl');

	/*
	 * 文件依赖
	 */
	var config = {
		baseUrl: baseUrl,           //依赖相对路径
		map: {
			'*': {
				'css': 'libs/require-css/css'
			}
		},
		paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
			zepto: 'libs/zepto.min',
			jquery: 'libs/jquery/jquery-1.12.0.min',
			underscore: 'libs/underscore/underscore',
			backbone: 'libs/backbone/backbone',
			text: 'libs/text' ,            //用于requirejs导入html类型的依赖
			bootstrap: 'libs/bootstrap/js/bootstrap',
			bootstrapTable: 'libs/bootstrap.table/bootstrap-table.min',
            bootstrapTableLocal: 'libs/bootstrap.table/bootstrap-table-zh-CN.min',
            box: 'libs/bootbox/bootbox.min',
			jqueryValid: 'libs/jquery/jquery.validate',
			jqueryForm: 'libs/jquery/jquery.form.min',
			jqueryCookie: 'libs/jquery/jquery.cookie',
			common: 'src/components/app/common',
			viewer: 'libs/tools/viewer-jquery.min',
            webuploader: 'libs/webUpload/webuploader'
		},
		shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
			'underscore': {
				exports: '_'
			},
			'jquery': {
				exports: 'jQuery'
			},
			'zepto': {
				exports: '$'
			},
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			},
			'bootstrap':{
				deps: [
					'jquery'
				]
			},
			'bootstrapTableLocal': {
                deps: [
                    // 'jquery', 'bootstrap', 'bootstrapTable', 'imgViewTool'
                    'jquery', 'bootstrap', 'bootstrapTable', 'box', 'jqueryValid', 'jqueryForm', 'jqueryCookie', 'common'
                ],
                exports: 'BootstrapTableLocal'
			},
			'bootstrapTable': {
                deps: [
                    'jquery', 'bootstrap'
                ],
                exports: 'BootstrapTable'
			},
            'box': {
                deps: [
                    'bootstrap'
                ],
                exports: 'Bootbox'
            },
			'jqueryValid': {
                deps: [
                    'jquery'
                ],
                exports: 'JqueryValid'
            },
            'jqueryForm': {
                deps: [
                    'jquery'
                ],
                exports: 'JqueryForm'
            },
            'jqueryCookie': {
                deps: [
                    'jquery'
                ],
                exports: 'JqueryCookie'
            },
			'common': {
                deps: [
                    'jquery', 'jqueryValid'
                ],
                exports: 'Common'
			}
		}
	};
	require.config(config);

	//Backbone会把自己加到全局变量中
	// Backbone, _, Bootstrap, config, AppView
	require(['backbone', 'underscore', 'bootstrap', 'bootstrapTableLocal', 'src/router/router-cfg-version', 'src/components/app/appView', 'box', 'viewer', 'webuploader'], function(Backbone, _, Bootstrap, BT, config, AppView, Bootbox, Viewer,Webuploader){
		new AppView();
		window.bootbox = Bootbox;
		Backbone.history.start();   //开始监控url变化
	});

})(window);
