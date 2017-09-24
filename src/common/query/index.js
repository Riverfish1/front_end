define([], function() {
	var QUERY = {
		LOGIN: '/api/login/loginPost',
		// 登记
        // 办公区登记
        RECORD_OFFICEAREA_INSERT: '/api/officeArea/insert',
        RECORD_OFFICEAREA_UPDATE: '/api/officeArea/updateById',
        RECORD_OFFICEAREA_DELETE: '/api/officeArea/deleteById',
        RECORD_OFFICEAREA_QUERY: '/api/officeArea/query',
        RECORD_OFFICEAREA_SELECT_BY_ID: '/api/officeArea/selectById',
		// 外来人员登记
		RECORD_VISITORS_INSERT: '/api/visitorsRecord/insert',
		RECORD_VISITORS_UPDATE: '/api/visitorsRecord/updateById',
		RECORD_VISITORS_DELETE: '/api/visitorsRecord/deleteById',
		RECORD_VISITORS_QUERY: '/api/visitorsRecord/query',
		RECORD_VISITORS_SELECT_BY_ID: '/api/visitorsRecord/selectById',
		// 岗位登记
		RECORD_POSTRECORD_INSERT: '/api/postRecord/insert',
		RECORD_POSTRECORD_UPDATE: '/api/postRecord/updateById',
		RECORD_POSTRECORD_DELETE: '/api/postRecord/deleteById',
		RECORD_POSTRECORD_QUERY: '/api/postRecord/query',
		RECORD_POSTRECORD_SELECT_BY_ID: '/api/postRecord/selectById',
		// 办公室登记
		RECORD_OFFICEROOM_INSERT: '/api/officeRoom/insert',
		RECORD_OFFICEROOM_UPDATE: '/api/officeRoom/updateById',
		RECORD_OFFICEROOM_DELETE: '/api/officeRoom/deleteById',
		RECORD_OFFICEROOM_QUERY: '/api/officeRoom/query',
		RECORD_OFFICEROOM_SELECT_BY_ID: '/api/officeRoom/selectById',
		// 部门登记
		RECORD_DEPARTMENT_INSERT: '/api/department/insert',
		RECORD_DEPARTMENT_UPDATE: '/api/department/updateById',
		RECORD_DEPARTMENT_DELETE: '/api/department/deleteById',
		RECORD_DEPARTMENT_QUERY: '/api/department/query',
		RECORD_DEPARTMENT_SELECT_BY_ID: '/api/department/selectById'
	};
	return QUERY;
})
