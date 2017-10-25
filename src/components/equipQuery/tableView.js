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
            this.$el.bootstrapTable('refresh', params);
        },
        init: function () {
            var that = this;
            this.$el.bootstrapTable({
                url: QUERY.EQUIP_QUERY, //请求后台的URL（*）
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
                    field: 'no',
                    title: '单据号',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'type',
                    title: '类型',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'date',
                    title: '办理日期',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value) {
                        return ncjwUtil.timeTurn(value, 'yyyy-mm-dd');
                    }
                }, {
                    field: 'operator',
                    title: '出入库日期',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '办理人',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '初始数量',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '入库数量',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '出库数量',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '结存数量',
                    align: 'center',
                    valign: "middle"
                }],
                responseHandler: function(res) {
                    return {
                        "total": res.total,
                        "rows": res.data ? res.data[0] : []
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