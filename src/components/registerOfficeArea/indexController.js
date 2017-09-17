define(['src/components/registerOfficeArea/indexModel', 'src/components/registerOfficeArea/indexView'], function (Model, View) {
    var controller = function (name) {
        var model = new Model();
        name && model.set({
            title: '办公区登记'
        });
        var view = new View({model:model});
        view.render();      //利用Model定义的默认属性初始化界面
        controller.onRouteChange = function () {
            view.undelegateEvents();
        };
    };

    return controller;
});