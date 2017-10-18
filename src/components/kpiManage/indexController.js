define(['src/components/kpiManage/indexView'], function (View) {
    var controller = function () {
        var view = new View();
        view.render();      //利用Model定义的默认属性初始化界面
        controller.onRouteChange = function () {
            view.undelegateEvents();
            view.$el.off();
        };
    };

    return controller;
});