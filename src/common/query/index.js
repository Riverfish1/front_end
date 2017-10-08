define([], function () {
    var QUERY = {
        LOGIN: '/api/login/loginPost',
        // 办公区登记
        RECORD_OFFICEAREA_INSERT: '/api/officeArea/insert',
        RECORD_OFFICEAREA_UPDATE: '/api/officeArea/updateById',
        RECORD_OFFICEAREA_DELETE: '/api/officeArea/deleteById',
        RECORD_OFFICEAREA_QUERY: '/api/officeArea/query',
        RECORD_OFFICEAREA_SELECT_BY_ID: '/api/officeArea/selectById',
        // 登记
        // 办公室登记
        RECORD_OFFICEROOM_INSERT: '/api/officeRoom/insert',
        RECORD_OFFICEROOM_UPDATE: '/api/officeRoom/updateById',
        RECORD_OFFICEROOM_DELETE: '/api/officeRoom/deleteById',
        RECORD_OFFICEROOM_QUERY: '/api/officeRoom/query',
        RECORD_OFFICEROOM_SELECT_BY_ID: '/api/officeRoom/selectById',
        // 部门登记 && 单位登记
        RECORD_DEPARTMENT_INSERT: '/api/department/insert',
        RECORD_DEPARTMENT_UPDATE: '/api/department/updateById',
        RECORD_DEPARTMENT_DELETE: '/api/department/deleteById',
        RECORD_DEPARTMENT_QUERY: '/api/department/query',
        RECORD_DEPARTMENT_SELECT_BY_ID: '/api/department/selectById',
        // 岗位登记
        RECORD_POSTRECORD_INSERT: '/api/postRecord/insert',
        RECORD_POSTRECORD_UPDATE: '/api/postRecord/updateById',
        RECORD_POSTRECORD_DELETE: '/api/postRecord/deleteById',
        RECORD_POSTRECORD_QUERY: '/api/postRecord/query',
        RECORD_POSTRECORD_SELECT_BY_ID: '/api/postRecord/selectById',
        // 人员信息登记
        RECORD_PEOPLE_INSERT: '/api/people/insert',
        RECORD_PEOPLE_UPDATE: '/api/people/updateById',
        RECORD_PEOPLE_DELETE: '/api/people/deleteById',
        RECORD_PEOPLE_QUERY: '/api/people/query',
        RECORD_PEOPLE_SELECT_BY_ID: '/api/people/selectById',
        RECORD_PEOPLE_ADD: '/api/people/addToCard',
        // 人员类型登记
        RECORD_PEOPLETYPE_INSERT: '/api/peopleType/insert',
        RECORD_PEOPLETYPE_UPDATE: '/api/peopleType/updateById',
        RECORD_PEOPLETYPE_DELETE: '/api/peopleType/deleteById',
        RECORD_PEOPLETYPE_QUERY: '/api/peopleType/query',
        RECORD_PEOPLETYPE_SELECT_BY_ID: '/api/peopleType/selectById',
        // 外来人员登记
        RECORD_VISITORS_INSERT: '/api/visitorsRecord/insert',
        RECORD_VISITORS_UPDATE: '/api/visitorsRecord/updateById',
        RECORD_VISITORS_DELETE: '/api/visitorsRecord/deleteById',
        RECORD_VISITORS_QUERY: '/api/visitorsRecord/query',
        RECORD_VISITORS_SELECT_BY_ID: '/api/visitorsRecord/selectById',
        // 办公
        // 人员档案
        WORK_STAFF_INSERT: '/api/workStaff/insert',
        WORK_STAFF_DELETE: '/api/workStaff/delete',
        WORK_STAFF_QUERY: '/api/workStaff/query',
        // 工作小结
        WORK_SUMMARY_INSERT: '/api/personalSummary/insert',
        WORK_SUMMARY_UPDATE: '/api/personalSummary/updateById',
        WORK_SUMMARY_DELETE: '/api/personalSummary/deleteById',
        WORK_SUMMARY_QUERY: '/api/personalSummary/query',
        WORK_SUMMARY_SELECT_BY_ID: '/api/personalSummary/selectById',
        // 信访管理

        // 领导预约

        //会议预定
        WORK_MEETING_INSERT: '/api/myBooking/insert',
        WORK_MEETING_UPDATE: '/api/myBooking/updateById',
        WORK_MEETING_DELETE: '/api/myBooking/deleteById',
        WORK_MEETING_QUERY: '/api/myBooking/query',
        WORK_MEETING_SELECT_BY_ID: '/api/myBooking/selectById',
        //待办事宜
        WORK_TODO_INSERT: '/api/personalTodo/insert',
        WORK_TODO_UPDATE: '/api/personalTodo/updateById',
        WORK_TODO_DELETE: '/api/personalTodo/deleteById',
        WORK_TODO_QUERY: '/api/personalTodo/query',
        WORK_TODO_SELECT_BY_ID: '/api/personalTodo/selectById',
        //快捷方式
        WORK_TODO_INSERT: '/api/personalTodo/insert',
        WORK_TODO_UPDATE: '/api/personalTodo/updateById',
        WORK_TODO_DELETE: '/api/personalTodo/deleteById',
        WORK_TODO_QUERY: '/api/personalTodo/query',
        WORK_TODO_SELECT_BY_ID: '/api/personalTodo/selectById',
    };
    return QUERY;
})
