/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    'text!./area.html',
    'text!./name.html',
    'text!./department.html',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, areaTpl, nameTpl, departmentTpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        initState: {
            employeeNum: '',
            peopleName: '',
            departmentId: '',
            positionName: '',
            titleList: [],
            titleName: '',
            phoneNum: '',
            mailAddress: '',
            officeAreaId: '',
            officeRoomId: '',
            id: ''
        },
        template: _.template(tpl),
        getAreaContent: _.template(areaTpl),
        getRoomContent: _.template(nameTpl),
        getDepartmentContent: _.template(departmentTpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #submitBtn': 'submitForm',
            'select #officeAreaBelong': 'selectAreaName'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            Backbone.off('itemAdd').on('itemAdd', this.addToCard, this);
        },
        render: function () {
            var that = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            };
            this.$el.empty().html(this.template());
            this.$officeDialog = this.$el.find('#editDialog');
            this.$officeDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            ncjwUtil.postData(QUERY.RECORD_POSTRECORD_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var data = res.data && res.data[0];
                    that.initState.titleList = data;
                }
            }, {
                'contentType': 'application/json'
            });
            return this;
        },
        addOne: function (row) {
            var that = this;
            var row = row.id ? row : this.initState;
            if (row.id) row.titleList = this.initState.titleList;
            this.$officeDialog.modal('show');
            this.$officeDialog.modal({backdrop: 'static', keyboard: false});
            this.$officeDialogPanel.empty().html(this.getDialogContent(row));
            this.$officeAreaBelong = this.$officeDialogPanel.find('#officeAreaBelong');
            this.$officeRoomBelong = this.$officeDialogPanel.find('#officeRoomBelong');
            this.$departmentBelong = this.$officeDialogPanel.find('#departmentBelong');
            this.getDepartmentList(row);
            this.getAreaList(row);
            $(this.$officeAreaBelong).change(function(e) {
                that.getRoomList({officeAreaId: e.target.value})
            });
            if (row.id) ncjwUtil.setFiledsValue(this.$officeDialogPanel, {titleName: row.titleName});
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        selectAreaName: function(e) {
            console.log(e);
        },
        getAreaList: function(row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEAREA_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    self.areaList = res.data ? res.data[0] : []
                    self.list = {list: self.areaList};
                    self.$officeAreaBelong.empty().html(self.getAreaContent(self.list));
                    if (!row.id) {
                        $('#officeAreaBelong').val(self.areaList[0].id);
                        self.getRoomList({officeAreaId: $('#officeAreaBelong').val()});
                    } else if (row.id) {
                        ncjwUtil.setFiledsValue(self.$officeDialogPanel, {officeAreaId: row.officeAreaId});
                        self.getRoomList({officeAreaId: row.officeAreaId});
                    }
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getRoomList: function(row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000,
                officeAreaId: row.officeAreaId
            }
            ncjwUtil.postData(QUERY.RECORD_OFFICEROOM_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var nameList = {nameList: res.data && res.data[0]};
                    self.$officeRoomBelong.empty().html(self.getRoomContent(nameList));
                    (row && row.id) && ncjwUtil.setFiledsValue(self.$officeDialogPanel, {officeRoomId: row.officeRoomId});
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
        },
        getDepartmentList: function(row) {
            var self = this;
            var params = {
                pageNum: 0,
                pageSize: 10000
            }
            ncjwUtil.postData(QUERY.RECORD_DEPARTMENT_QUERY, JSON.stringify(params), function (res) {
                if (res.success) {
                    var departmentList = {departmentList: res.data && res.data[0]};
                    self.$departmentBelong.empty().html(self.getDepartmentContent(departmentList));
                    (row && row.id) && ncjwUtil.setFiledsValue(self.$officeDialogPanel, {departmentId: row.departmentId});
                } else {
                }
            }, {
                "contentType": 'application/json'
            })
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
                ownerPeopleId: window.ownerPeopleId,
                targetPeopleId: row.id
            };
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
                        ncjwUtil.postData(QUERY.WORK_ADDRESSLIST_INSERT, JSON.stringify(peopleInfo), function (res) {
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
                        required: true,
                    },
                    positionName: {
                        required: true,
                    },
                    phoneNum: {
                        required: true,
                        isPhoneNum: true
                    },
                    mailAddress: {
                        required: true,
                        isMailAddrss: true
                    }
                },
                messages: {
                    employeeNum: {
                        required: '请输入工号',
                        number: '必须为数字'
                    },
                    peopleName: {
                        required: '请输入名字'
                    },
                    positionName: {
                        required: '请输入岗位'
                    },
                    phoneNum: {
                        required: '请输入电话号码'
                    },
                    mailAddress: {
                        required: '请输入邮箱地址'
                    }
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
            jQuery.validator.addMethod('isPhoneNum', function(value, ele) {
                return this.optional(ele) || (QUERY.TEL_REG.test(value));
            }, '请填写正确的手机号码');
            jQuery.validator.addMethod('isMailAddrss', function(value, ele) {
                return this.optional(ele) || (QUERY.EMAIL_REG.test(value));
            }, '请填写正确的邮编号码');
        },
        submitForm: function (e) {
            if(this.$editForm.valid()){
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                var JSONData = JSON.parse(datas);
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.RECORD_PEOPLE_UPDATE : QUERY.RECORD_PEOPLE_INSERT, JSON.stringify(JSONData), function (res) {
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