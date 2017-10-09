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
			webuploader: 'libs/webUpload/webuploader',
			datepicker: 'libs/bootstrap-datepicker/bootstrap-datepicker',
			datetimepicker: 'libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
			datetimepicker_zh: 'libs/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',
			datepicker_zh: 'libs/bootstrap-datepicker/bootstrap-datepicker.zh-CN'
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
				deps: ['jquery']
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
			},
      'webuploader': {
        deps: [
            'jquery'
        ],
        exports: 'WebUploader'
      },
      'datepicker': {
      	deps: ['jquery'],
      	exports: 'Datepicker'
      },
      'datepicker_zh': {
      	deps: ['jquery', 'datepicker'],
      	exports: 'DatepickerCN'
      },
      'datetimepicker': {
      	deps: ['jquery'],
      	exports: 'Datetimepicker'
      },
      'datetimepicker_zh': {
      	deps: ['jquery', 'datetimepicker'],
      	exports: 'DatetimepickerCN'
      }
		}
	};
	require.config(config);

	//Backbone会把自己加到全局变量中
	// Backbone, _, Bootstrap, config, AppView
	require([
			'backbone',
			'underscore',
			'bootstrap',
			'bootstrapTableLocal',
			'src/router/router-cfg-version',
			'src/components/app/appView',
			'box',
			'viewer',
			'webuploader',
			'datepicker',
			'datepicker_zh',
			'datetimepicker',
			'datetimepicker_zh'
		], function(Backbone, _, Bootstrap, BT, config, AppView, Bootbox, Viewer, WebUploader, Datepicker, DatepickerCN, Datetimepicker, DatetimepickerCN){
		new AppView();
		window.backbone = Backbone;
		window.bootbox = Bootbox;
		window.WebUploader = WebUploader;
		Backbone.history.start();   //开始监控url变化
	});

})(window);
