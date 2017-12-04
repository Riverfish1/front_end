/*global define*/
define(['../../common/query/index'], function (QUERY) {
    'use strict';
    var Table = Backbone.View.extend({
        el: '#kpi_manage',
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
                url: QUERY.KPI_MANAGE_QUERY, //请求后台的URL（*）
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
                    width: '15%',
                    field: 'kpiName',
                    title: '关键业务指标',
                    align: 'center',
                    valign: "middle"
                }, {
                    width: '15%',
                    field: 'targetNumber',
                    title: '目标数值',
                    align: 'center',
                    valign: "middle"
                }, {
                    width: '15%',
                    field: 'postKpi',
                    title: '岗位指标设定',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'performance',
                    title: '完成情况',
                    align: 'center',
                    valign: "middle",
                    width: '20%'
                }, {
                    field: 'startDate',
                    title: '开始日期',
                    align: 'center',
                    width: '15%',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                    }
                }, {
                    field: 'endDate',
                    title: '结束日期',
                    align: 'center',
                    width: '15%',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return ncjwUtil.timeTurn(value, 'yyyy-MM-dd');
                    }
                }, {
                    field: 'oper',
                    title: '操作',
                    align: 'center',
                    valign: "middle",
                    width: '5%',
                    events: this.operateEvents,
                    formatter: function (value, row, index) {
                        var str = '<p class="grid-command-p btn-view">查看</p>';
                        str += '<p class="grid-command-p btn-delete">删除</p>';
                        return str;
                    }
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
        },
        operateEvents: {
            'click .btn-view': function (e, value, row, index) {
                Backbone.trigger('itemView', row);
            },
            'click .btn-delete': function (e, value, row, index) {
                Backbone.trigger('itemDelete', row);
            }
        }
    });
    return Table;
});