/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemAdd').on('itemAdd', this.addToCard, this);
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        addOne: function (row) {
            var initState = {
                employeeNum: '',
                peopleName: '',
                departmentId: '',
                positionName: '',
                titleName: '',
                phoneNum: '',
                mailAddress: '',
                officeAreaId: '',
                officeRoomId: '',
                id: ''
            };
            var row = row.id ? row : initState;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row))
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        delOne: function (row) {
            var that = this;
            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: '确认'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: "温馨提示",
                message: '执行删除后将无法恢复，确定继续吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.RECORD_PEOPLE_DELETE, {id: row.id}, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('删除成功');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError("删除失败：" + res.errorMsg);
                            }
                        })
                    }
                }

            });
        },
        addToCard: function (row) {
            var that = this;
            var peopleInfo = {
                "ownerPeopleId": window.ownerPeopleId,
                "targetPeopleId": row.id
            };
            var datas = serializeJSON(JSON.stringify(peopleInfo)).slice(2, -2);
            bootbox.confirm({
               buttons: {
                    confirm: {
                        label: '确认'
                    },
                    cancel: {
                        label: '取消'
                    }
                },
                title: "加入名片夹",
                message: '确认加入名片夹吗？',
                callback: function (result) {
                    if (result) {
                        ncjwUtil.postData(QUERY.WORK_ADDRESSLIST_INSERT, datas, function (res) {
                            if (res.success) {
                                ncjwUtil.showInfo('加入名片夹成功！');
                                that.table.refresh();
                            } else {
                                ncjwUtil.showError('加入名片夹失败！');
                            }
                        }, {
                            "contentType": 'application/json'
                        });
                    }
                }
            });
        },
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    employeeNum: {
                        required: true,
                        number: true
                    },
                    peopleName: {

                    },
                    departmentId: {

                    },
                    positionName: {

                    },
                    titleName: {

                    },
                    phoneNum: {

                    },
                    mailAddress: {

                    },
                    officeAreaId: {

                    },
                    officeRoomId: {
                        
                    }
                },
                messages: {
                    name: "请输入名称",
                    gmtCreate: "请输入时间"
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                success: function (label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorPlacement: function (error, element) {
                    element.parent('div').append(error);
                }
            });
        },
        submitForm: function (e) {
            if(this.$editForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                console.log(data);
                data = decodeURIComponent(data, true);
                console.log(data);
                var datas = serializeJSON(data);
                console.log(datas);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.RECORD_PEOPLE_UPDATE : QUERY.RECORD_PEOPLE_INSERT, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$officeDialog.modal('hide');
                        that.table.refresh();
                    } else {
                        ncjwUtil.showError("保存失败：" + res.errorMsg);
                    }
                }, {
                    "contentType": 'application/json'
                })
            }
        }
    });
    return View;
});