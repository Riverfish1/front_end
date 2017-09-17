/**
 * Created by kenkozheng on 2015/7/10.
 */

'use strict';

(function (win) {
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
            // zepto: 'libs/zepto.min',
            jquery: 'libs/jquery/jquery-1.12.0.min',
            underscore: 'libs/underscore/underscore',
            backbone: 'libs/backbone/backbone',
            text: 'libs/text' ,            //用于requirejs导入html类型的依赖
            bootstrap: 'libs/bootstrap/js/bootstrap',
        },
        shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
            'underscore': {
                exports: '_'
            },
            'jquery': {
                exports: '$'
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
                    'jquery',
                    'css!libs/bootstrap/css/bootstrap.css',
                    'css!libs/bootstrap/css/font-awesome.min.css'
                ]
            }
            // bootstrap: {
            //     deps: [
            //         'jquery'
            //     ],
            //     exports: 'Bootstrap'
            // },
        }
    };

    require.config(config);

    //Backbone会把自己加到全局变量中
    // Backbone, _, Bootstrap, config, AppView
    require(['backbone', 'underscore', 'bootstrap', 'src/router/router-cfg-version', 'src/components/app/appView'], function(Backbone, _, Bootstrap, config, AppView){
        new AppView();
        Backbone.history.start();   //开始监控url变化
    });

})(window);
