/*global define*/
define([
    'text!./upload.html',
    '../../common/query/index'
], function (tpl, QUERY) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#uploaderWrap',
        template: _.template(tpl),
        initialize: function () {
            this.render();
            this.createUpload();
        },
        render: function () {
            this.$el.empty().html(this.template());
            return this;
        },
        createUpload: function () {
            // $(function () {
            var $ = jQuery,
                $list = $('#fileList'),
                $btn = $('#ctlBtn'),
                state = 'pending',
                fileList = [],
                uploader;

            uploader = WebUploader.create({

                // 不压缩image
                resize: false,

                // swf文件路径
                swf: 'libs/webUpload/Uploader.swf',

                // 文件接收服务端。
                server: QUERY.FILE_UPLOAD,
                formData: {"path": "createRepay"},

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#filePicker',
                fileNumLimit: 10,
                fileSizeLimit: 200*1024,
                fileSingleSizeLimit: 200*1024
            });

            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                $list.append('<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">等待上传...</p>' +
                    '</div>');
            });

            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress .progress-bar');

                // 避免重复创建
                if (!$percent.length) {
                    $percent = $('<div class="progress progress-striped active">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div>' +
                        '</div>').appendTo($li).find('.progress-bar');
                }

                $li.find('p.state').text('上传中');

                $percent.css('width', percentage * 100 + '%');
            });

            uploader.on('uploadSuccess', function (file, response) {
                $('#' + file.id).find('p.state').text('已上传');
                if (response.success == true) {
                    fileList.push(response.data[0])
                    $('#filePath').val(fileList.join(","));
                    $('.filePathWrap').html(response.data[0]).show();
                }
            });

            uploader.on('uploadError', function (file) {
                $('#' + file.id).find('p.state').text('上传出错');
            });

            uploader.on('uploadComplete', function (file) {
                $('#' + file.id).find('.progress').fadeOut();
            });

            uploader.on('all', function (type) {
                if (type === 'startUpload') {
                    state = 'uploading';
                } else if (type === 'stopUpload') {
                    state = 'paused';
                } else if (type === 'uploadFinished') {
                    state = 'done';
                }

                if (state === 'uploading') {
                    $btn.text('暂停上传');
                } else {
                    $btn.text('开始上传');
                }
            });

            $btn.on('click', function () {
                if (state === 'uploading') {
                    uploader.stop();
                } else {
                    uploader.upload();
                }
            });
        }
    });
    return View;
});