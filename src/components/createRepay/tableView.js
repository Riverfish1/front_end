/*global define*/
define(['../../common/query/index'], function (QUERY) {
    'use strict';
    var Table = Backbone.View.extend({
        el: '#tableWrap',
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
            var typeMap = {
                "0": "借款单",
                "1": "经费报销单",
                "2": "差旅报销单",
                "3": "还款单"
            }
            this.$el.bootstrapTable({
                url: QUERY.REPAY_CREATE_QUERYMYREIM, //请求后台的URL（*）
                method: 'get', //请求方式（*）
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
                    field: 'title',
                    title: '标题',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'type',
                    title: '报销类型',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return typeMap[value];
                    }
                }, {
                    field: 'totalMoney',
                    title: '金额',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value;
                    }
                }, {
                    field: 'acceptTime',
                    title: '接收日期',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value ? ncjwUtil.timeTurn(value, 'yyyy-MM-dd') : "";
                    }
                }, {
                    field: 'createTime',
                    title: '创建日期',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value ? ncjwUtil.timeTurn(value, 'yyyy-MM-dd') : "";
                    }
                }, {
                    field: 'currentNodeName',
                    title: '当前节点',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'creatorName',
                    title: '创建人',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'workFlow',
                    title: '领导',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value ? JSON.parse(value).nodeList[0].operatorName : '';
                    }
                }, {
                    field: 'workFlow',
                    title: '财务',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value ? JSON.parse(value).nodeList[1].operatorName : '';
                    }
                }, {
                    field: 'status',
                    title: '操作',
                    align: 'center',
                    valign: "middle",
                    events: this.operateEvents,
                    formatter: function (value, row, index) {
                        var str = '';
                        var workFlow = row.workFlow.length ? JSON.parse(row.workFlow) : row.workFlow;
                        var currentNodeName = workFlow.currentNode.nodeName;
                        var nodeList = row.workFlow ? JSON.parse(row.workFlow).nodeList: [];
                        var leaderId = nodeList[0].operatorId;
                        var financerId = nodeList[1].operatorId;
                        var peopleId = window.ownerPeopleId;
                        if(peopleId == row.creatorId || peopleId == leaderId || peopleId == financerId){
                            str += '<p class="grid-command-p btn-edit">查看</p>';
                        }
                        // if(((peopleId == leaderId && currentNodeName == "领导审批") || (peopleId == financerId && currentNodeName == "财务审批") ) && row.status == "submit"){
                        //     str += '<p class="grid-command-p btn-edit">处理</p>';
                        // }
                        if(value == "submit"){
                            str += '<p class="grid-command-p btn-delete">删除</p>';
                        }
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
                pageSize: params.limit,
                id: window.ownerPeopleId

            };
            return temp;
        },
        operateEvents: {
            'click .btn-edit': function (e, value, row, index) {
                Backbone.trigger('itemEdit', row);
            },
            'click .btn-delete': function (e, value, row, index) {
                Backbone.trigger('itemDelete', row);
            }
        }
    });
    return Table;
});