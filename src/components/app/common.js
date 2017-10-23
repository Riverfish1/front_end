//常用工具函数
var ncjwUtil = (function ($) {
    'use strict';
    //提示信息
    var showInfo = function (title, detail) {
        $('#info-success-id').html("<strong><i class='icon-ok'></i> " + title + "</strong>");
        $('#info-success-id').show().delay(5000).fadeOut();
    }
    var showError = function (title, detail) {
        $('#info-error-id').html("<strong><i class='icon-remove'></i> " + title + "</strong>");
        $('#info-error-id').show().delay(5000).fadeOut();
    }

    var _getRootPath = function () {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
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
                } else {
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

    /**
     * 格式化时间戳为日期
     * @param time
     * @param fmt
     * @returns {*|string}
     */
    var formatTime = function (timeStr, fmt) {
        if (!timeStr) {
            return "";
        }
        var fmt = fmt || "yyyy-MM-dd hh:mm:ss";
        var time = {};
        if (Object.prototype.toString.call(timeStr) !== "[object Date]") {
            // time = /^\d*$/.test(timeStr) ? new Date(timeStr) : parseDate(timeStr);
            time = new Date(timeStr);
        } else {
            time = timeStr;
        }
        var o = {
            "M+": time.getMonth() + 1, //月份
            "d+": time.getDate(), //日
            "h+": time.getHours(), //小时
            "m+": time.getMinutes(), //分
            "s+": time.getSeconds(), //秒
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度
            "S": time.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };


    //时间戳转换（具体到秒）2016-10-9 12:00:00
    var timeTurn = function (d, fmt) {
        return formatTime(d, fmt);
    };

    //获取当前的日期 2012-05-03 星期三
    var getCurrentDate = function (d) {
        var d = d ? new Date(d) : new Date();
        return timeTurn(d.getTime(), 'yyyy-MM-dd') + "&nbsp;&nbsp;星期" + "日一二三四五六".charAt(d.getDay())
    }

    //填充form数据
    var setFiledsValue = function (parentEle, obj) {
        for (var i in obj) {
            //buiForm.setFieldValue( i, obj[i] );
            if (parentEle.find("[name=" + i + "]").hasClass("calendar-time")) {
                parentEle.find("[name=" + i + "]").val(timeTurn(obj[i]));
            } else {
                parentEle.find("[name=" + i + "]").val(obj[i]);
            }
        }
    }
    //全部选中
    var sellectAll = function (parentEle) {
        parentEle.find('input').attr("checked", true);
    }
    //全不选
    var unSellectAll = function (parentEle) {
        parentEle.find('input').attr("checked", false);
    }
    //部分选中
    var selectSome = function (parentEle, obj) {
        for (var i in obj) {
            parentEle.find("[name=" + i + "]").attr('checked', true)
        }
    }
    // 获得周几
    var getDate = function (date) {
        var week = "星期" + "日一二三四五六".charAt(new Date(date).getDay());
        return week;
    }
    //readOnly为true时，编辑页面disable
    function setDisableEditPage(readOnly) {
        if (readOnly) {
            $('select, input, textarea').attr('disabled', true);
        } else {
            $('select, input, textarea').removeAttr('disabled');
        }
    }

    return {
        //将方法暴露出来 JSON格式数
        showInfo: showInfo,
        showError: showError,
        getData: getData,
        postData: postData,
        setFiledsValue: setFiledsValue,
        timeTurn: timeTurn,
        getDate: getDate,
        getCurrentDate: getCurrentDate,
        sellectAll: sellectAll,
        unSellectAll: unSellectAll,
        selectSome: selectSome,
        setDisableEditPage: setDisableEditPage
    };
})(jQuery);

var serializeJSON = function (data) {
    data = data.replace(/&/g, "\",\"");
    data = data.replace(/=/g, "\":\"");
    data = "{\"" + data + "\"}";
    return data;
}
/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var timeUtil = (function ($) {
    'use strict';
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }

    function setNow(d) {
        now = new Date(d);
        nowDayOfWeek = now.getDay(); //今天本周的第几天
        nowDay = now.getDate(); //当前日
        nowMonth = now.getMonth(); //当前月
        nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //

        lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        lastYear = lastMonthDate.getYear();
        lastMonth = lastMonthDate.getMonth();
    }

    //获得当前日期
    function getCurrentDay(myMonth) {
        return ncjwUtil.timeTurn(now.getTime(), 'yyyy-MM-dd');
    }

    //获得某月的天数
    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }

    //获得本季度的开始月份
    function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }

    //获得本周的开始日期
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return formatDate(weekStartDate);
    }

    //获得本周的结束日期
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return formatDate(weekEndDate);
    }

    //获得本月的开始日期
    function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }

    //获得本月的结束日期
    function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDate(monthEndDate);
    }

    //获得上月开始时间
    function getLastMonthStartDate() {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return formatDate(lastMonthStartDate);
    }

    //获得上月结束时间
    function getLastMonthEndDate() {
        var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return formatDate(lastMonthEndDate);
    }

    //获得本季度的开始日期
    function getQuarterStartDate() {

        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
        return formatDate(quarterStartDate);
    }

    //获得本季度的结束日期
    function getQuarterEndDate() {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
        return formatDate(quarterStartDate);
    }

    function getYearStartDate() {
        return nowYear + "-01-01"
    }

    function getYearEndDate() {
        return nowYear + "-12-31"
    }


    return {
        //将方法暴露出来 JSON格式数
        setNow: setNow,
        getCurrentDay: getCurrentDay,
        getWeekStartDate: getWeekStartDate,
        getWeekEndDate: getWeekEndDate,
        getMonthStartDate: getMonthStartDate,
        getMonthEndDate: getMonthEndDate,
        getLastMonthStartDate: getLastMonthStartDate,
        getLastMonthEndDate: getLastMonthEndDate,
        getQuarterStartDate: getQuarterStartDate,
        getQuarterEndDate: getQuarterEndDate,
        getYearStartDate: getYearStartDate,
        getYearEndDate: getYearEndDate
    };
})(jQuery);



