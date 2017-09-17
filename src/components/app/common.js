//常用工具函数
var ncjwUtil = (function ($) {
    'use strict';
    //提示信息
    var showInfo = function(title, detail){
        $('#info-success-id').html("<strong>"+title+"</strong>" );
        $('#info-success-id').show ().delay (3000).fadeOut ();
    }
    var showError=function(title,detail){
        $('#info-error-id').html("<strong>"+title+"</strong>" );
        $('#info-error-id').show ().delay (3000).fadeOut ();
    }

    var _getRootPath = function () {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath=window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName=window.document.location.pathname;
        var pos=curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht=curWwwPath.substring(0,pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhostPaht+projectName);
    }

    var context = _getRootPath();

    /**
     * 内部请求方法
     * @param path
     * @param data
     * @param successCbk
     * @param options
     * @param methodType
     * @private
     */
    var _sendAjax = function (path, data, successCbk, options, methodType) {
        //添加请求时的mask
        var ajaxParams = {
            'type': methodType,
            'url': context + path,
            'data': data,
            'dataType': 'json',
            'success': function (result) {
                if (result.rc == 0 || !result.rc) {
                    successCbk(result);
                }else {
                    //ajax 返回错误时的 处理
                    if (options && options.handleError) {
                        options.handleError(result);
                    } else {
                        showInfo(result.errorInfo);
                    }
                }
            },
            'error': function () {
                showError('网络连接出错');
            },
            complete: function () {

            }
        };
        //针对不同的请求方式的额外配置
        if (options) {
            for (var item in options) {
                if (item != 'maskTitle' || item != 'maskContainer') {
                    ajaxParams[item] = options[item];
                }
            }
        }
        $.ajax(ajaxParams);
    }


    /**
     * ajax通用方法
     * getData 适用get请求 postData适用
     * path 接口地址
     * data 请求数据
     * successCbk 请求成功回调方法
     */
        //get请求
    var getData = function (path, data, successCbk, options) {
            _sendAjax(path, data, successCbk, options, 'get')
        };
    //post请求
    var postData = function (path, data, successCbk, options) {
        _sendAjax(path, data, successCbk, options, 'post')
    };

    //验证信息
    $.extend($.validator.messages, {
        required: "必选字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
        minlength: $.validator.format("请输入一个 长度最少是 {0} 的字符串"),
        rangelength: $.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
        range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: $.validator.format("请输入一个最大为{0} 的值"),
        min: $.validator.format("请输入一个最小为{0} 的值")
    });

    return {
        //将方法暴露出来 JSON格式数
        showInfo: showInfo,
        showError: showError,
        getData: getData,
        postData: postData
    };
})(jQuery);

// define([], function () {
//     'use strict';
//     //提示信息
//     var showInfo = function(title, detail){
//         $('#info-success-id').html("<strong>"+title+"</strong>" );
//         $('#info-success-id').show ().delay (3000).fadeOut ();
//     }
//     var showError=function(title,detail){
//         $('#info-error-id').html("<strong>"+title+"</strong>" );
//         $('#info-error-id').show ().delay (3000).fadeOut ();
//     }
//
//     var ncjwUtil = {
//         showInfo: showInfo,
//         showError: showError
//     }
//
//     return ncjwUtil;
// });