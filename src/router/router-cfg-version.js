/* global define */
/* global require */
define(['backbone'], function (Backbone) {

    var routesMap = {
        'register/officeArea': 'src/components/registerOfficeArea/indexController.js',
        'register/workArea': 'src/components/list/listController.js',
        // 'work/department': 'src/components/list/listController.js',
        // 'work/department': 'src/components/list/listController.js',
        'login': 'src/components/login/indexController.js',
        'work/department': 'src/components/workDepartment/indexController.js',
        'work/staff': 'src/components/workStaff/indexController.js',
        'register/visitors': 'src/components/visitorsRecord/indexController.js',
        'register/post': 'src/components/postRecord/indexController.js',
        'register/department': 'src/components/departmentRecord/indexController.js',
        'register/officeRoom': 'src/components/officeRoom/indexController.js'

        // '*actions': 'defaultAction'
    };

    var Router = Backbone.Router.extend({

        routes: routesMap,

        defaultAction: function () {
            console.log('404');
            location.hash = 'module2';
        }

    });

    var router = new Router();
    var oldHashFirst = null;
    //彻底用on route接管路由的逻辑，这里route是路由对应的value
    router.on('route', function (route, params) {
        require([route], function (controller) {
            if (router.currentController && router.currentController !== controller) {
                router.currentController.onRouteChange && router.currentController.onRouteChange();
            }
            var hash = window.location.href.split('#')[1];
            var hashFirst = hash.split('/')[1]
            if(hashFirst != oldHashFirst){
                Backbone.trigger('routeChange', hash);
            }
            oldHashFirst = hashFirst;

            router.currentController = controller;
            controller.apply(null, params);     //每个模块约定都返回controller
        });
    });

    return router;
});