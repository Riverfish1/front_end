define([], function () {
    var QUERY = {
        LOGIN: '/api/login/loginPost',
        // 登记
        // 办公区登记
        RECORD_OFFICEAREA_INSERT: '/api/officeArea/insert',
        RECORD_OFFICEAREA_UPDATE: '/api/officeArea/updateById',
        RECORD_OFFICEAREA_DELETE: '/api/officeArea/deleteById',
        RECORD_OFFICEAREA_QUERY: '/api/officeArea/query',
        RECORD_OFFICEAREA_SELECT_BY_ID: '/api/officeArea/selectById',
        // 图片上传
        IMG_UPLOAD: '/api/image/imageUpload',
        // 模糊人员查询
        FUZZY_QUERY: '/api/people/fuzzyQuery',
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
        // 通讯录
        WORK_ADDRESSLIST_QUERY: '/api/addressList/query',
        WORK_ADDRESSLIST_INSERT: '/api/addressList/insert',
        WORK_ADDRESSLIST_DELETE: '/api/addressList/deleteById',
        // 工作小结
        WORK_SUMMARY_INSERT: '/api/personalSummary/insert',
        WORK_SUMMARY_UPDATE: '/api/personalSummary/updateById',
        WORK_SUMMARY_DELETE: '/api/personalSummary/deleteById',
        WORK_SUMMARY_QUERY_BY_PEOPLE: '/api/personalSummary/queryByPeopleId',
        WORK_SUMMARY_QUERY_BY_LEADER: '/api/personalSummary/queryByLeaderId',
        WORK_SUMMARY_SELECT_BY_ID: '/api/personalSummary/selectById',
        WORK_SUMMARY_AGREE: '/api/personalSummary/agree',
        WORK_SUMMARY_REJECT: '/api/personalSummary/reject',

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
        WORK_SHOT_INSERT: '/api/shortCut/insert',
        WORK_SHOT_UPDATE: '/api/shortCut/updateByUserId',
        // WORK_SHOT_DELETE: '/api/shortCut/deleteById',
        WORK_SHOT_QUERY: '/api/shortCut/query',
        // WORK_SHOT_SELECT_BY_ID: '/api/shortCut/selectById',
        //信访管理
        WORK_PETITIONMNG_INSERT: '/api/petitionManagement/insert',
        WORK_PETITIONMNG_UPDATE: '/api/petitionManagement/updateById',
        WORK_PETITIONMNG_QUERY: '/api/petitionManagement/query',
        WORK_PETITIONMNG_SELECT_BY_ID: '/api/petitionManagement/selectById',
        // 领导预约
        WORK_APPOINTMENT_INSERT: '/api/appointmentRecord/insert',
        WORK_APPOINTMENT_QUERY: '/api/appointmentRecord/query',
        WORK_APPOINTMENT_UPDATE: '/api/appointmentRecord/updateById',
        WORK_APPOINTMENT_DELETE: '/api/appointmentRecord/deleteById',
        WORK_APPOINTMENT_SELECT_BY_ID: '/api/appointmentRecord/selectById',
        // 工作授权
        WORK_AUTH_INSERT: '/api/workAuth/insert',
        WORK_AUTH_UPDATE: '/api/workAuth/updateById',
        WORK_AUTH_DELETE: '/api/workAuth/deleteById',
        WORK_AUTH_QUERY: '/api/workAuth/queryByUserId',
        WORK_AUTH_SELECT_BY_ID: '/api/workAuth/selectById',
        //发文管理
        WORK_SENDDOCUMENT_NEW: '/api/docsend/new',
        WORK_SENDDOCUMENT_SUBMIT: '/api/docsend/submit',
        WORK_SENDDOCUMENT_AGREE: '/api/docsend/agree',
        WORK_SENDDOCUMENT_REJECT: '/api/docsend/reject',
        WORK_SENDDOCUMENT_QUERY_BY_ID: '/api/docsend/queryByUserId',
        WORK_SENDDOCUMENT_SELECT_BY_ID: '/api/docsend/selectById',
        WORK_SENDDOCUMENT_UPDATE: '/api/docsend/updateById',
        WORK_SENDDOCUMENT_DELETE: '/api/docsend/deleteById',
        //收文管理
        WORK_RECEIVEDOCUMENT_NEW: '/api/docrecv/new',
        WORK_RECEIVEDOCUMENT_SUBMIT: '/api/docrecv/submit',
        WORK_RECEIVEDOCUMENT_AGREE: '/api/docrecv/agree',
        WORK_RECEIVEDOCUMENT_REJECT: '/api/docrecv/reject',
        WORK_RECEIVEDOCUMENT_QUERY_BY_ID: '/api/docrecv/queryByUserId',
        WORK_RECEIVEDOCUMENT_SELECT_BY_ID: '/api/docrecv/selectById',
        WORK_RECEIVEDOCUMENT_UPDATE: '/api/docrecv/updateById',
        WORK_RECEIVEDOCUMENT_DELETE: '/api/docrecv/deleteById',
        //请示报告
        WORK_REQUESTDOCUMENT_NEW: '/api/workReport/new',
        WORK_REQUESTDOCUMENT_SUBMIT: '/api/workReport/submit',
        WORK_REQUESTDOCUMENT_AGREE: '/api/workReport/agree',
        WORK_REQUESTDOCUMENT_REJECT: '/api/workReport/reject',
        WORK_REQUESTDOCUMENT_QUERY_BY_ID: '/api/workReport/queryByUserId',
        WORK_REQUESTDOCUMENT_SELECT_BY_ID: '/api/workReport/selectById',
        WORK_REQUESTDOCUMENT_UPDATE: '/api/workReport/updateById',
        WORK_REQUESTDOCUMENT_DELETE: '/api/workReport/deleteById',
        //交办协办
        WORK_WORKASSIGN_NEW: '/api/cooperation/new',
        WORK_WORKASSIGN_SUBMIT: '/api/cooperation/submit',
        WORK_WORKASSIGN_AGREE: '/api/cooperation/agree',
        WORK_WORKASSIGN_REJECT: '/api/cooperation/reject',
        WORK_WORKASSIGN_QUERY_BY_ID: '/api/cooperation/queryByUserId',
        WORK_WORKASSIGN_SELECT_BY_ID: '/api/cooperation/selectById',
        WORK_WORKASSIGN_UPDATE: '/api/cooperation/updateById',
        WORK_WORKASSIGN_DELETE: '/api/cooperation/deleteById',
        //通知管理
        WORK_NOTICEMANAGE_NEW: '/api/noticeRecord/new',
        WORK_NOTICEMANAGE_SUBMIT: '/api/noticeRecord/submit',
        WORK_NOTICEMANAGE_AGREE: '/api/noticeRecord/agree',
        WORK_NOTICEMANAGE_REJECT: '/api/noticeRecord/reject',
        WORK_NOTICEMANAGE_QUERY_BY_ID: '/api/noticeRecord/queryByUserId',
        WORK_NOTICEMANAGE_SELECT_BY_ID: '/api/noticeRecord/selectById',
        WORK_NOTICEMANAGE_UPDATE: '/api/noticeRecord/updateById',
        WORK_NOTICEMANAGE_DELETE: '/api/noticeRecord/deleteById',


        // 一些基本正则
        TEL_REG: /(^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/,
        EMAIL_REG: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
        ID_CARD_REG: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
    };
    return QUERY;
})
