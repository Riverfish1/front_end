/*global define*/
define(['../../common/query/index'], function (QUERY) {
    'use strict';
    var Table = Backbone.View.extend({
        el: '#equip',
        initialize: function () {
        },
        showLoading: function () {
            this.$el.bootstrapTable('load', []);
            this.$el.bootstrapTable('showLoading');
        },

        hideLoading: function () {
            this.$el.bootstrapTable('hideLoading');
        },
        render: function () {
            this.init();
        },
        refresh: function (params) {
            console.log(params);
            this.$el.bootstrapTable('refresh', params);
        },
        init: function () {
            var that = this;
            this.$el.bootstrapTable({
                url: QUERY.ASSETS_WARN_QUERY, //请求后台的URL（*）
                method: 'post', //请求方式（*）
                toolbar: '#toolbar', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                queryParams: this.queryParams,//传递参数（*）
                sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageSize: 20, //每页的记录行数（*）
                pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                showColumns: true, //是否显示所有的列
                showRefresh: true, //是否显示刷新按钮
                minimumCountColumns: 2, //最少允许的列数
                clickToSelect: true, //是否启用点击选中行
                // height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "ID", //每一行的唯一标识，一般为主键列
                showToggle: true, //是否显示详细视图和列表视图的切换按钮
                cardView: false, //是否显示详细视图
                detailView: false, //是否显示父子表
                columns: [{
                    field: 'assetNo',
                    title: '资产编号',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetName',
                    title: '资产名称',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetClassName',
                    title: '资产类别',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetUsedName',
                    title: '使用人',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetDepartmentName',
                    title: '使用部门',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetBuyDate',
                    title: '购入时间',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetExpireDate',
                    title: '到期时间',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'assetDeadline',
                    title: '使用期限（月）',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'operatorName',
                    title: '登记人',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'status',
                    title: '资产状态',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value) {
                        switch (value) {
                            case 0: return '闲置';
                            case 1: return '已领用';
                            case 2: return '维修中';
                            case 3: return '已报废';
                            default: return '-';
                        }
                    }
                }],
                responseHandler: function(res) {
                    return {
                        "total": res.total,
                        "rows": res.data && res.data[0]
                    }
                }
            });
        },
        queryParams: function (params) {
            var temp = {
                pageNum: params.offset / params.limit,
                pageSize: params.limit
            };
            return temp;
        }
    });
    return Table;
});