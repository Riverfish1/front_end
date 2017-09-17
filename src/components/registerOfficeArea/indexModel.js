/**
 * Created by yujian on 2017/08/14.
 */

define([], function () {
    var Model = Backbone.Model.extend({
        //模型默认的数据
        defaults: function () {
            return {
                'el': '#main',
                'tableId': '#list-table',
                'title': '办公区登记',
                'btnTitle': '新增办公区'
            };
        }
    });

    return Model;
});