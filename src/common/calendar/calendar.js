define(['jquery'], function ($) {
    return {
        monthDate: null,
        $wrapper: null,
        day: new Date().getDate(),
        _date: new Date(),
        getMonthData: function (year, month) {
            var ret = [];

            if (!year || !month) {
                var today = new Date();
                this.day = today.getDate();
                year = today.getFullYear();
                month = today.getMonth() + 1;
            }

            /*这个月的第一天*/
            var firstDay = new Date(year, month - 1, 1);
            /*这个第一天是周几*/
            var firstDayWeekDay = firstDay.getDay();
            /*周日赋值为7*/
            if (firstDayWeekDay === 0) firstDayWeekDay = 7;

            year = firstDay.getFullYear();
            month = firstDay.getMonth() + 1;

            /*上个月的最后一天*/
            var lastDayOfLastMonth = new Date(year, month - 1, 0);
            /*存储上个月的最后一天*/
            var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

            /*第一行要显示多少个上个月的日期*/
            var preMonthDayCount = firstDayWeekDay - 1;

            /*当月的最后一天*/
            var lastDay = new Date(year, month, 0);
            var lastDate = lastDay.getDate();

            /*获取六周日期*/
            for (var i = 0; i < 7 * 5; i++) {
                var date = i + 1 - preMonthDayCount;
                var showDate = date;
                var thisMonth = month;
                if (date <= 0) {
                    //上一月
                    thisMonth = month - 1;
                    showDate = lastDateOfLastMonth + date;
                } else if (date > lastDate) {
                    //下一月
                    thisMonth = month + 1;
                    showDate = showDate - lastDate;
                }

                if (thisMonth === 0) thisMonth = 12;
                if (thisMonth === 13) thisMonth = 1;

                ret.push({
                    month: thisMonth,
                    date: date,
                    showDate: showDate
                })
            }

            return {
                year: year,
                month: month,
                day: this.day,
                days: ret
            };

        },
        buildUi: function (year, month) {

            this.monthDate = this.getMonthData(year, month);

            var html = '<div class="ui-datepicker-header">' +
                '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
                '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
                '<span class="ui-datepicker-curr-month">' + this.monthDate.year + '-' + this.monthDate.month + '</span>' +
                '</div>' +
                '<div class="ui-datepicker-body">' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th>一</th>' +
                '<th>二</th>' +
                '<th>三</th>' +
                '<th>四</th>' +
                '<th>五</th>' +
                '<th>六</th>' +
                '<th>日</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            for (var i = 0; i < this.monthDate.days.length; i++) {
                var date = this.monthDate.days[i];
                if (i % 7 === 0) {
                    html += '<tr>';
                }
                html += '<td data-date="' + this.monthDate.days[i].date + '">' +
                    this.monthDate.days[i].showDate +
                    '</td>';
                if (i % 7 === 6) {
                    html += '</tr>';
                }
            }
            html += '</tbody>' +
                '</table>' +
                '</div>';
            return html;
        },
        render: function (direction, container) {
            var year, month;
            container = document.querySelector(container) || document.body;

            if (this.monthDate) {
                year = this.monthDate.year;
                month = this.monthDate.month;
            }

            if (direction === "prev") {
                month--;
                if (month === 0) {
                    month = 12;
                    year--;
                }
            }
            if (direction === 'next') month++;

            var html = this.buildUi(year, month);

            if (!this.$wrapper) {
                this.$wrapper = document.createElement("div");
                this.$wrapper.className = "ui-datepicker-wrapper";
            }

            this.$wrapper.innerHTML = html;
            container.appendChild(this.$wrapper);
        },
        showOrHide: function (show) {
            if (show) {
                if (this.$wrapper.classList) {
                    this.$wrapper.classList.add('ui-datepicker-wrapper-show');
                }
            } else {
                if (this.$wrapper.classList) {
                    this.$wrapper.classList.remove('ui-datepicker-wrapper-show');
                }
            }
        },
        init: function (container) {
            var self = this;
            this.render(null, container);
            this.selCurrentDay();
            this.showOrHide(true);
            var $wrap = $(this.$wrapper);
            $wrap.off();
            var prevOrNextHandler = function (e) {
                var $target = $(e.target);
                if (!$target.hasClass('ui-datepicker-btn')) return;
                /*上个月*/
                if ($target.hasClass('ui-datepicker-prev-btn')) {
                    self.render('prev',container);
                }
                /*下个月*/
                else if ($target.hasClass('ui-datepicker-next-btn')) {
                    self.render('next',container);
                }
            }
            var tdHandler = function (e) {
                var $target = e.target, $el = $(e.target);
                //jquery
                $('.ui-datepicker-body').find('td').removeClass('active');
                if ($target.tagName.toLocaleLowerCase() !== 'td') return;
                $(e.target).addClass('active');
                var date = new Date(self.monthDate.year, self.monthDate.month - 1, $el.attr('data-date'));
                self._date = date;
                // $input.value = format(date);
            }
            $wrap.off();
            $wrap.on('click', prevOrNextHandler);
            $wrap.on('click', tdHandler);
        },
        selCurrentDay: function () {
            var $td = $('.ui-datepicker-body').find('td[data-date=' + this.getDay() + ']');
            $td.addClass('active');
        },
        getDay: function () {
          return this.day;
        },
        getDate: function () {
          return this._date;
        },
        format: function (date) {
            ret = '';
            var padding = function (num) {
                if (num <= 9) {
                    return '0' + num;
                }
                return num;
            }
            ret += date.getFullYear() + '-';
            ret += padding(date.getMonth() + 1) + '-';
            ret += padding(date.getDate());
            return ret;
        }
    }
});