/* global define */
/* global require */
define(['backbone'], function (Backbone) {

    var routesMap = {
        //首页
        'home': 'src/components/home/indexController.js',
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
        // 个人总结
        'work/mySummary': 'src/components/workSummary/indexController.js',
        // 收到的总结
        'work/summaryReceived': 'src/components/workSummaryReceived/indexController.js',
        // 信访管理
        'work/petitionMng': 'src/components/petitionMng/indexController.js',
        // 领导预约
        'work/myAppointment': 'src/components/workAppointment/indexController.js',
        // 收到的预约
        'work/appointmentReceived': 'src/components/workAppointmentReceived/indexController.js',
        // 办文管理——发文管理
        'work/sendDocument': 'src/components/sendDocument/indexController.js',
        // 办文管理——收文管理
        'work/receiveDocument': 'src/components/receiveDocument/indexController.js',
        // 请示报告
        'work/requestDocument': 'src/components/requestDocument/indexController.js',
        // 工作授权
        'work/auth': 'src/components/workAuth/indexController.js',
        // 我发起的交办协办
        'work/createCooperation': 'src/components/createCooperation/indexController.js',
        // 我收到的交办协办
        'work/receiveCooperation': 'src/components/receiveCooperation/indexController.js',
        // 通知管理
        'work/noticeRecord': 'src/components/noticeRecord/indexController.js',
        //我发布的通知
        'work/sendNoticeRecord': 'src/components/sendNoticeRecord/indexController.js',
        //收到的通知
        'work/receiveNoticeRecord': 'src/components/receiveNoticeRecord/indexController.js',
        //个人绩效管理
        'assess/personnelSummary': 'src/components/personnelSummary/indexController.js',
        // 领导考核
        'assess/leaderCommunicate': 'src/components/leaderCommunicate/indexController.js',
        // 考核指标管理
        'assess/kpiManage': 'src/components/kpiManage/indexController.js',
        // 临时交办工作管理
        'assess/assignManage': 'src/components/assignManage/indexController.js',
        // 考勤
        'assess/attendance': 'src/components/assessAttendance/indexController.js',
        // 我的考勤
        'assess/myAttendance': 'src/components/myAttendance/indexController.js',
        // 资产登记
        'support/assetsRecord': 'src/components/assetsRecord/indexController.js',
        // 资产领用
        'support/assetsReceive': 'src/components/assetsReceive/indexController.js',
        // 资产维修
        'support/assetsMaintain': 'src/components/assetsMaintain/indexController.js',
        // 资产报废
        'support/assetsScrap': 'src/components/assetsScrap/indexController.js',
        // 资产预警
        'support/assetsWarn': 'src/components/assetsWarn/indexController.js',
        // 文件登记
        'support/fileRecord': 'src/components/fileRecord/indexController.js',
        // 资产统计
        'support/assetsCount': 'src/components/assetsCount/indexController.js',
        // 资产类别管理
        'support/assetsCate': 'src/components/assetsCate/indexController.js',
        // 装备入库
        'support/equipIn': 'src/components/equipIn/indexController.js',
        // 装备出库
        'support/equipOut': 'src/components/equipOut/indexController.js',
        // 装备调拨
        'support/equipAllot': 'src/components/equipAllot/indexController.js',
        // 库存盘点
        'support/stocking': 'src/components/stocking/indexController.js',
        // 装备领用
        'support/equipCollect': 'src/components/equipCollect/indexController.js',
        // 装备管理
        'support/equipMng': 'src/components/equipMng/indexController.js',
        // 仓库管理
        'support/storeMng': 'src/components/storeMng/indexController.js',
        // 装备查询
        'support/equipQuery': 'src/components/equipQuery/indexController.js',
        // 库存查询
        'support/storeQuery': 'src/components/storeQuery/indexController.js',


        // 差旅报销管理-我的报销
        'support/createRepay': 'src/components/createRepay/indexController.js',
        // 差旅报销管理-待处理的报销
        'support/receiveRepay': 'src/components/receiveRepay/indexController.js',
        // 借款或报销查询
        'support/feeQuery': 'src/components/feeQuery/indexController.js',
        '*actions': 'defaultAction'
    };

    var isFirst = true;

    var Router = Backbone.Router.extend({

        routes: routesMap,

        defaultAction: function () {
            if(isFirst){
                location.hash = '#/home';
                isFirst = false;
            }
        }

    });

    var router = new Router();
    var oldHashFirst = null;
    //彻底用on route接管路由的逻辑，这里route是路由对应的value
    router.on('route', function (route, params) {
        //修复默认路由加载defaultAction.js的bug;
        if(route == "defaultAction"){
            return false;
        }
        require([route], function (controller) {
            if (router.currentController && router.currentController !== controller) {
                router.currentController.onRouteChange && router.currentController.onRouteChange();
            }
            isFirst = false;
            var hash = window.location.href.split('#')[1];
            var hashFirst = hash.split('/')[1]
            if(hashFirst != oldHashFirst){
                Backbone.trigger('routeChange', hash);
            }
            oldHashFirst = hashFirst;

            router.currentController = controller;
            controller.apply(null, params);     //每个模块约定都返回controller
            //根据hash隐藏不同的首页容器
            if(hashFirst == "home"){
                $('#app').find('.menuWrap').hide();
                $('#app').find('.homeWrap').show();
            }else{
                $('#app').find('.menuWrap').show();
                $('#app').find('.homeWrap').hide();
            }
        });
    });

    return router;
});