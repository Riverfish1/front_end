/**
 * Created by yujian on 2017/08/14.
 */

define([], function () {
    var ListModel = Backbone.Model.extend({

        //模型默认的数据
        defaults: function () {
            return {
                videoNum: "0",
                uploadTime: "",
                playNum: "0"
            };
        },
        urlRoot: './api/list'

        // // 定义一些方法
        // fetch: function () {
        //     // var o = this;
        //     // //可以做一些http请求
        //     // setTimeout(function(){
        //     //     o.set({name:'vivi'});
        //     //     o.trigger('nameEvent');     //向view触发事件
        //     // }, 1000);
        //    var o = this;
        //    o.set
        // }

    });

    return ListModel;
});