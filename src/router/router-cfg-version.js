/* global define */
/* global require */
define(['backbone'], function (Backbone) {

    var routesMap = {
        // 首页
        'index': 'src/components/home/indexController.js',
        // 办公区登记
        'register/officeArea': 'src/components/officeAreaRecord/indexController.js',
        // 办公室登记
        'register/officeRoom': 'src/components/officeRoomRecord/indexController.js',
        // 单位登记
        'register/company': 'src/components/companyRecord/indexController.js',
        // 部门登记
        'register/department': 'src/components/departmentRecord/indexController.js',
        // 人员信息
        'register/people': 'src/components/peopleRecord/indexController.js',
        // 人员类型
        'register/peopleType': 'src/components/peopleTypeRecord/indexController.js',
        // 岗位登记
        'register/post': 'src/components/postRecord/indexController.js',
        // 外来人员登记
        'register/visitors': 'src/components/visitorsRecord/indexController.js',
        // 部门档案
        'work/department': 'src/components/workDepartment/indexController.js',
        // 人员档案
        'work/staff': 'src/components/workStaff/indexController.js',
        // 会议预定
        'work/meeting': 'src/components/workMeetingSchedule/indexController.js',
        // 待办事宜
        'work/todo': 'src/components/workToDo/indexController.js',
        // 个人小结
        'work/mySummary': 'src/components/workSummary/indexController.js',
        // 收到的小结
        'work/summaryReceived': 'src/components/workSummaryReceived/indexController.js',
        // 信访管理
        'work/petitionMng': 'src/components/petitionMng/indexController.js',
        // 领导预约
        'work/myAppointment': 'src/components/workAppointment/indexController.js',
        // 办文管理——发文管理
        'work/sendDocument': 'src/components/sendDocument/indexController.js'


        // '*actions': 'defaultAction'
    };

    var Router = Backbone.Router.extend({

        routes: routesMap,

        defaultAction: function () {
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