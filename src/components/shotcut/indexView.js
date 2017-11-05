/*global define*/
define([
    'backbone',
    'text!src/components/shotcut/index.html',
    'text!src/components/shotcut/dialog.html',
    'src/components/sidebar/navSidebarModel',
    '../../common/query/index'
], function (Backbone, tpl, dialogTpl, navSidebarModel, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '.shotMenu',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click a.item': 'active',
            'click .shotcutBtn': 'addOne'
        },
        initialize: function () {
            Backbone.off('shotcutBtnClick').on('shotcutBtnClick', this.addOne, this);
            this.userShotCut = [];
            this.render();
        },
        render: function () {
            var $parent = this.$el.parents('#navbar');
            this.$editDialog = $parent.find('#shotcutDialog');
            this.$editPanel = this.$editDialog.find('#editPanel');
            this.getData();
            return this;
        },
        removeActiveClass: function () {
            this.$el.find('li').removeClass('active');
        },
        active: function (e) {
            var $el = $(e.target);
            $el = $el.hasClass('item') ? $el : $el.parents('.item');
            $('.shotMenu').find('li').removeClass('active');
            $el.parent().addClass('active');
        },
        getData: function () {
            var self = this;
            var params = {
                userId: window.ownerPeopleId
            };
            ncjwUtil.postData(QUERY.WORK_SHOT_QUERY, JSON.stringify(params), function (res) {
                var list = {list: (res.data && res.data[0]) || []}
                if (res.success) {
                    self.$el.empty().html(self.template(list));
                    self.userShotCut = list.list;
                    self.removeActiveClass();
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getEditData: function () {
            var self = this;
            ncjwUtil.getData(QUERY.WORK_SHOT_QUERY_ALL, null, function (res) {
                var list = {list: res || []}
                if (res) {
                    self.$editPanel.empty().html(self.getDialogContent(list));
                    self.setChecked(self.userShotCut);
                } else {
                    ncjwUtil.showError(res.errorMsg);
                }
            })
        },
        addOne: function (row) {
            var initData = {areaName: '', areaUsage: ''};
            var row = initData.areaName ? row : initData;
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.getEditData();
            this.$editForm = this.$el.find('#editForm');
            this.$submitBtn = this.$editDialog.find('#submitBtn');
            this.$submitBtn.off().on('click', $.proxy(this.submitForm, this))
        },
        submitForm: function (e) {
            var that = this;
            var params = this.getCheck();
            // var url = this.isFirstAdd ? QUERY.WORK_SHOT_INSERT : QUERY.WORK_SHOT_UPDATE;
            var url = QUERY.WORK_SHOT_UPDATE;
            if (params.length > 0) {
                ncjwUtil.postData(url, JSON.stringify(params), function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo('保存成功！');
                        that.$editDialog.modal('hide');
                        //刷新快捷方式菜单
                        that.getData();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            } else {
                ncjwUtil.showInfo('请选择快捷方式！');
            }
        },
        getCheck: function () {
            var $input = this.$editPanel.find('input');
            var params = [];
            var obj = {};
            $.each($input, function (k, el) {
                obj.id = $(el).val();
                obj.url = $(el).attr('data-url');
                obj.userId = window.ownerPeopleId;
                obj.menuName = $(el).attr('data-name');
                obj.checked = $(el).prop('checked') == true ? 1 : 0;
                if (obj.checked == 1) {
                    params.push(obj);
                }
                obj = {};
            })
            return params;
        },
        setChecked: function (d) {
            var self = this;
            $.each(d, function (k, v) {
                var $input = self.$editPanel.find('[data-name=' + v.menuName + ']');
                if($input.length > 0){
                    $input.prop('checked', true);
                }
            });
        }
    });
    return View;
});