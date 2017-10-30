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
                "0": "收文管理",
                "1": "发文管理"
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
                columns: [
                    {
                        field: 'nodeIndex',
                        title: '序号',
                        align: 'center',
                        valign: "middle",
                        visible: false,
                        width: '80px'
                    },
                    {
                        field: 'nodeName',
                        title: '节点名称',
                        align: 'center',
                        valign: "middle",
                        width: '80px'
                    }, {
                        field: 'operatorName',
                        title: '审批人',
                        align: 'center',
                        valign: "middle",
                        width: '80px'
                    }, {
                        field: 'status',
                        title: '操作',
                        align: 'center',
                        valign: "middle",
                        width: '80px',
                        events: this.operateEvents,
                        formatter: function (value, row, index) {
                            var str = '';
                            str += '<p class="grid-command-p btn-detailEdit">修改</p>';
                            str += '<p class="grid-command-p btn-detailDelete">删除</p>';
                            return str;
                        }
                    }]
            });
        },
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