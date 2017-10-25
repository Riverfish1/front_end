/*global define*/
define(['../../common/query/index'], function (QUERY) {
    'use strict';
    var Table = Backbone.View.extend({
        el: '.repayTableWrap',
        initialize: function () {
        },
        showLoading: function () {
            this.$el.bootstrapTable('load', []);
            this.$el.bootstrapTable('showLoading');
        },

        hideLoading: function () {
            this.$el.bootstrapTable('hideLoading');
        },
        render: function (data) {
            this.init(data);
        },
        refresh: function (params) {
            this.$el.bootstrapTable('refresh', params);
        },
        load: function (data) {
            // this.init();
            this.$el.bootstrapTable('load', data);
        },
        init: function (data) {
            var typeMap = {
                "0": "借款单",
                "1": "经费报销单",
                "2": "差旅报销单",
                "3": "还款单"
            }
            this.$el.bootstrapTable({
                data: data,
                // toolbar: '#toolbar', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                // height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "ID", //每一行的唯一标识，一般为主键列
                columns: [{
                    field: 'id',
                    title: '序号',
                    align: 'center',
                    valign: "middle",
                    width: '10%'
                }, {
                    field: 'time',
                    title: '费用日期',
                    align: 'center',
                    valign: "middle",
                    width: '20%',
                    formatter: function (value, row) {
                        return value ? ncjwUtil.timeTurn(value, 'yyyy-MM-dd') : '';
                    }
                }, {
                    field: 'type',
                    title: '报销类型',
                    align: 'center',
                    valign: "middle",
                    width: '15%',
                    formatter: function (value, row) {
                        return typeMap[value];
                    }
                }, {
                    field: 'description',
                    title: '使用说明',
                    align: 'center',
                    width: '25%',
                    valign: "middle"
                }, {
                    field: 'money',
                    title: '报销金额',
                    align: 'center',
                    width: '15%',
                    valign: "middle",
                    formatter: function (value, row) {
                        return value;
                    }
                }, {
                    field: 'status',
                    title: '操作',
                    align: 'center',
                    valign: "middle",
                    width: '15%',
                    events: this.operateEvents,
                    formatter: function (value, row, index) {
                        var str = '';
                        str += '<p class="grid-command-p btn-detailEdit">修改</p>';
                        str += '<p class="grid-command-p btn-detailDelete">删除</p>';
                        return str;
                    }
                }],
                // responseHandler: function (res) {
                //     return {
                //         "total": res.total,
                //         "rows": res.data && res.data[0]
                //     }
                // }
            });
        },
        // queryParams: function (params) {
        //     var temp = {
        //         pageNum: params.offset / params.limit,
        //         pageSize: params.limit,
        //         id: window.ownerPeopleId
        //
        //     };
        //     return temp;
        // },
        operateEvents: {
            'click .btn-detailEdit': function (e, value, row, index) {
                Backbone.trigger('itemDetailEdit', row);
            },
            'click .btn-detailDelete': function (e, value, row, index) {
                Backbone.trigger('itemDetailDelete', row);
            }
        }
    });
    return Table;
});