define([], function() {
	var QUERY = {
		LOGIN: '/api/login/loginPost',
		// 登记
		// 外来人员登记
		RECORD_VISITORS_INSERT: '/api/visitorsRecord/insert',
		RECORD_VISITORS_UPDATE: '/api/visitorsRecord/update',
		RECORD_VISITORS_DELETE: '/api/visitorsRecord/delete',
		RECORD_VISITORS_QUERY: '/api/visitorsRecord/query',
		RECORD_VISITORS_SELECT_BY_ID: '/api/visitorsRecord/selectById',
		// 岗位登记
		RECORD_POSTRECORD_INSERT: '/api/postRecord/insert',
		RECORD_POSTRECORD_UPDATE: '/api/postRecord/update',
		RECORD_POSTRECORD_DELETE: '/api/postRecord/delete',
		RECORD_POSTRECORD_QUERY: '/api/postRecord/query',
		RECORD_POSTRECORD_SELECT_BY_ID: '/api/postRecord/selectById',
		// 办公室登记
		RECORD_OFFICEROOM_INSERT: '/api/officeRoom/insert',
		RECORD_OFFICEROOM_UPDATE: '/api/officeRoom/update',
		RECORD_OFFICEROOM_DELETE: '/api/officeRoom/delete',
		RECORD_OFFICEROOM_QUERY: '/api/officeRoom/query',
		RECORD_OFFICEROOM_SELECT_BY_ID: '/api/officeRoom/selectById',
		// 部门登记
		RECORD_DEPARTMENT_INSERT: '/api/department/insert',
		RECORD_DEPARTMENT_UPDATE: '/api/department/update',
		RECORD_DEPARTMENT_DELETE: '/api/department/delete',
		RECORD_DEPARTMENT_QUERY: '/api/department/query',
		RECORD_DEPARTMENT_SELECT_BY_ID: '/api/department/selectById'
	};
	return QUERY;
})
