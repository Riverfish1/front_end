/*global define*/
define([
    './tableView',
    'text!./index.html',
    'text!./dialog.html',
    './upload',
    '../../common/query/index'
], function (BaseTableView, tpl, dialogTpl, FileUploadView, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#main',
        template: _.template(tpl),
        getDialogContent: _.template(dialogTpl),
        events: {
            'click #btn_add': 'addOne',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
            'click #btn-submit': 'submitForm'
        },
        initialize: function () {
            Backbone.off('itemEdit').on('itemEdit', this.addOne, this);
            Backbone.off('itemDelete').on('itemDelete', this.delOne, this);
            window.ownerPeopleId = 4;
            window.ownerdepartmentName = "张三";
        },
        render: function () {
            //main view
            this.$el.empty().html(this.template());
            this.$editDialog = this.$el.find('#editDialog');
            this.$editDialogPanel = this.$el.find('#editPanel');
            this.table = new BaseTableView();
            this.table.render();
            return this;
        },
        initSuggest: function () {
            this.$suggestWrap.bsSuggest('init', {
                effectiveFieldsAlias: {departmentName: "部门名称", id: "部门ID", parentName: "单位"},
                clearable: true,
                showHeader: true,
                showBtn: false,
                allowNoKeyword: true,
                // getDataMethod: "url",
                getDataMethod: "firstByUrl",
                delayUntilKeyup: true,
                // url: "src/components/sendDocument/data.json",
                url: QUERY.RECORD_DEPARTMENT_QUERY,
                idField: "id",
                keyField: "departmentName",
                fnAdjustAjaxParam: function (keyword, opts) {
                    return {
                        method: 'post',
                        data: JSON.stringify({
                            userPaged: false
                            // departmentName: keyword
                        }),
                        'contentType': 'application/json'
                    };
                },
                processData: function (json) {
                    var data = {value: []};
                    $.each(json.data && json.data[0], function (i, r) {
                        data.value.push({departmentName: r.departmentName, parentName: r.parentName, id: r.id})
                    })
                    return data;
                }
            }).on('onDataRequestSuccess', function (e, result) {
            }).on('onSetSelectValue', function (e, keyword, data) {
                var $row = $(e.target).parents('.input-group')
                var $operatorName = $row.find('input[name=departmentName]');
                var $validInput = $row.find('.departmentId');
                var $helpBlock = $row.find('.help-block');
                $validInput.val(data.id);
                $operatorName.val(data.departmentName);
                $helpBlock.remove();
            }).on('onUnsetSelectValue', function () {});
        },
        initBtnEvent: function () {
            var method = $(this).text();
            var $i;

            if (method === 'init') {
                this.initSuggest();
            } else {
                $i = this.$suggestWrap.bsSuggest(method);
                if (typeof $i === 'object') {
                    $i = $i.data('bsSuggest');
                }
                console.log(method, $i);
                if (!$i) {
                    alert('未初始化或已销毁');
                }
            }

            if (method === 'version') {
                alert($i);
            }
        },
        addOne: function (row) {
            //id不存在与staus==3都是新建；
            var initState = {
                title: '',
                content: '',
                status: 'submit',
                startTime: '',
                endTime: '',
                filePath: '',
                creatorId: window.ownerPeopleId,
                creatorName: window.ownerdepartmentName,
                departmentId: '',
                departmentName: '',
                sNumber: '',
                id: ''
            };
            var row = row.id ? row : initState;
            if(row.id){
                row.startTime = ncjwUtil.timeTurn(row.startTime);
                row.endTime = ncjwUtil.timeTurn(row.endTime);
            }
            this.showOrhideBtn(row);
            this.$editDialog.modal('show');
            this.$editDialog.modal({backdrop: 'static', keyboard: false});
            this.$editDialogPanel.empty().html(this.getDialogContent(row));
            this.fileUpload = new FileUploadView();
            this.$suggestWrap = this.$editDialogPanel.find('.test');
            this.$suggestBtn = this.$suggestWrap.find('button');
            this.initSuggest();
            row.id && (this.setBssuggestValue(row));
            this.$suggestBtn.off('click').on('click', $.proxy(this.initBtnEvent, this));
            $('.accessTime').datepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                format: 'yyyy-mm-dd'
            });
            this.$editForm = this.$el.find('#editForm');
            this.initSubmitForm();
        },
        showOrhideBtn: function (row) {
            if(row.status == "finish"){
                this.$editDialog.find('.status-button').hide();
            }else{
                this.$editDialog.find('.status-button').show();
            }
        },
        setBssuggestValue: function (row) {
            this.$suggestWrap.val(row.departmentId);
            // this.$suggestWrap.val(row.departmentName);
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
                        ncjwUtil.postData(QUERY.WORK_NOTICERECORD_DELETE, {id: row.id}, function (res) {
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
        initSubmitForm: function () {
            this.$editForm.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                rules: {
                    title: {
                        required: true
                    },
                    content: {
                        required: true
                    },
                    startTime: {
                        required: true
                    },
                    endTime: {
                        required: true
                    },
                    departmentId: {
                        required: true
                    },
                    sNumber: {
                        required: true
                    }
                },
                messages: {
                    title: "请填写标题",
                    sNumber: "请填写编号",
                    content: "请填写正文",
                    startTime: "请选择开始时间",
                    endTime: "请选择结束时间",
                    departmentId: "请选择交办人"
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
            if (this.$editForm.valid()) {
                var that = this;
                var $form = $(e.target).parents('.modal-content').find('#editForm');
                var data = $form.serialize();
                data = decodeURIComponent(data, true);
                var datas = serializeJSON(data);
                try{
                    datas = JSON.parse(datas);
                    datas.departmentId = [datas.departmentId];
                    datas = JSON.stringify(datas);
                }catch(e){

                }
                console.log("datas", datas);
                return false;
                var id = $('#id').val();
                ncjwUtil.postData(id ? QUERY.WORK_NOTICERECORD_UPDATE : QUERY.WORK_NOTICERECORD_NEW, datas, function (res) {
                    if (res.success) {
                        ncjwUtil.showInfo(id ? '修改成功！' : '新增成功！');
                        that.$editDialog.modal('hide');
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