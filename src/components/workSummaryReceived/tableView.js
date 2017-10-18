/*global define*/
define(['../../common/query/index'], function (QUERY) {
    'use strict';
    var Table = Backbone.View.extend({
        el: '#work_summaryReceived',
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
        refresh: function () {
            this.$el.bootstrapTable('refresh');
        },
        init: function () {
            var that = this;
            this.$el.bootstrapTable({
                url: QUERY.WORK_SUMMARY_QUERY_BY_LEADER, //请求后台的URL（*）
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
                    field: 'name',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'time',
                    title: '时间',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value, row) {
                        var date = ncjwUtil.timeTurn(row.summaryStartTime, 'yyyy/MM/dd') +
                        ' - ' + ncjwUtil.timeTurn(row.summaryEndTime, 'yyyy/MM/dd');
                        return date;
                    }
                }, {
                    field: 'summaryTitle',
                    title: '标题',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'summaryContent',
                    title: '内容',
                    align: 'center',
                    valign: "middle"
                }, {
                    field: 'gmtCreate',
                    title: '记录日期',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value) {
                        return ncjwUtil.timeTurn(value);
                    }
                }, {
                    field: 'summaryStatus',
                    title: '总结状态',
                    align: 'center',
                    valign: "middle",
                    formatter: function (value) {
                        switch (value) {
                            case 'create': return '未审阅';
                            case 'agree': return '已通过';
                            case 'reject': return '已驳回';
                            default: return '-';
                        }
                    }
                }, {
                    field: 'oper',
                    title: '操作',
                    align: 'center',
                    valign: "middle",
                    events: this.operateEvents,
                    formatter: function (value, row, index) {
                        var str = '';
                        if (row.summaryStatus === 'create') {
                            str += '<p class="grid-command-p btn-pass">通过</p>';
                            str += '<p class="grid-command-p btn-reject">驳回</p>';
                            str += '<p class="grid-command-p btn-view">查看</p>';
                        } else {
                            str += '<p class="grid-command-p btn-view">查看</p>';
                        }
                        return str;
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
                pageSize: params.limit,
                id: window.ownerPeopleId
                // departmentname: $("#txt_search_departmentname").val(),
                // statu: $("#txt_search_statu").val()
            };
            return temp;
        },
        operateEvents: {
            'click .btn-pass': function (e, value, row, index) {
                Backbone.trigger('itemPass', row, 'pass');
            },
            'click .btn-rejcet': function (e, value, row, index) {
                Backbone.trigger('itemReject', row, 'reject');
            },
            'click .btn-view': function (e, value, row, index) {
                Backbone.trigger('itemView', row)
            }
        }
    });
    return Table;
});