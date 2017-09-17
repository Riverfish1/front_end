/**
 * Created by yujian on 2017/08/14.
 */
define(['module1/view1'], function (View) {

    var controller = function () {
        var view = new View();
        view.render('kenko');
    };
    return controller;
});