var Mock = require('mockjs');
var Qs = require('qs');

var movie = {
    'id|+1': 1,
    'name': '@Name'
};

var name = {
    'id|+1': 1,
    'first': '@FIRST',
    'last': '@LAST'
};

var list = {
    'list|1-10': [{
        'id|+1': 1,
        'name': '@Name',
        'age|1-100': 100,
        'status|1': [0, 1, 2, 3]
    }],
    'success': true,
    'rc|1': [0, 1]
}

var listMock = {
    'videoNum|1-100': 100,
    'uploadTime|1-1000': 10,
    'playNum|1-100': 100
}

var listOfficArea = {
    total: '30',
    'rows|30': [{
        'id|+1': '1',
        'areaName' : '@Title',
        'areaUsage' : '@Title',
        'areaSize|1-10': '10',
        'areaAddress': '@Address',
        'areaPhotoAddress': 'static/images/logo_teb.png',
        'areaDescription': '@Title'
    }],
    'success': true,
    'rc|1': [0]
}
var delOfficeAreaList = {
    'success': true,
    'rc|1': [0],
    'errorMsg': '更新成功'
}

var commonDataReturn = {
    'success': true,
    'msg': '登录成功'
}

module.exports = {

    'GET /y.do': function (req, res) {
        res.status(200);
        res.jsonp(Mock.mock({'data': movie, 'success': true}), 'cb');
    },

    'POST /z.do': function (req, res) {
        var postData = Qs.parse(req.body);
        var pageSize = postData.pageSize;
        var currentPage = postData.currentPage;
        name['id|+1'] = pageSize * (currentPage - 1);
        var tmpl = {};
        tmpl['dataList|' + pageSize] = [name];
        tmpl['success'] = true;
        tmpl['pageSize'] = pageSize;
        tmpl['currentPage'] = currentPage;
        res.json(Mock.mock(tmpl));
    },

    'GET /x.do': Mock.mock({'name': '@Name'}),
    'GET /api/login': Mock.mock(commonDataReturn),
    'GET /api/list.do': Mock.mock(list),
    'GET /api/list': Mock.mock(listMock),
    'GET /api/register/officeArea': Mock.mock(listOfficArea),
    'GET /api/del/register/officeArea': Mock.mock(delOfficeAreaList),
    'POST /api/saveOrUpdate/register/officeArea': Mock.mock(delOfficeAreaList),
    'POST /officeArea/insert': Mock.mock(delOfficeAreaList)
};
