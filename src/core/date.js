import { isDate, isString, keys } from './base'

/**
 * 获取时间戳
 *
 * @returns Number
 */
export var now = Date.now || function () {
  return new Date().getTime()
}

/**
  * 字符串转为日期
  *
  * @param {String} str 日期或数字
  * @param {String} format 解析日期格式(yyyy年份、MM月份、dd天、HH小时、mm分钟、ss秒、SSS毫秒)
  * @return {String}
  */
export function stringToDate (str, format) {
  if (str) {
    if (isDate(str)) {
      return str
    }
    if (!isNaN(str)) {
      return new Date(str)
    }
    if (isString(str)) {
      format = format || 'yyyy-MM-dd HH:mm:ss.SSS'
      var dates = [];
      [{rules: [['yyyy', 4], ['yyy', 3], ['yy', 2]]},
      {rules: [['MM', 2], ['M', 1]], offset: -1},
      {rules: [['dd', 2], ['d', 1]]},
      {rules: [['HH', 2], ['H', 1]]},
      {rules: [['mm', 2], ['m', 1]]},
      {rules: [['ss', 2], ['s', 1]]},
      {rules: [['SSS', 3], ['SS', 2], ['S', 1]]}].forEach(item => {
        for (let arr, sIndex, index = 0, rules = item.rules, len = rules.length; index < len; index++) {
          arr = rules[index]
          sIndex = format.indexOf(arr[0])
          if (sIndex > -1) {
            dates.push(parseFloat(str.substring(sIndex, sIndex + arr[1]) || 0) + (item.offset || 0))
            break
          } else if (index === len - 1) {
            dates.push(0)
          }
        }
      })
      return new Date(...dates)
    }
  }
  return 'Invalid Date'
}

/**
  * 日期格式化为字符串
  *
  * @param {Date} date 日期或数字
  * @param {String} format 输出日期格式(yyyy年份、MM月份、dd天、HH小时、mm分钟、ss秒、S毫秒、E星期几、q季度)
  * @return {String}
  */
export function dateToString (date, format) {
  date = stringToDate(date)
  if (isDate(date)) {
    var result = format || 'yyyy-MM-dd HH:mm:ss'
    var weeks = ['日', '一', '二', '三', '四', '五', '六']
    var resDate = {
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'M+': date.getMonth() + 1,
      'E+': date.getDay(),
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(result)) {
      result = result.replace(RegExp.$1, ('' + date.getFullYear()).substr(4 - RegExp.$1.length))
    }
    keys(resDate).forEach(key => {
      if (new RegExp('(' + key + ')').test(result)) {
        let val = '' + resDate[key]
        result = result.replace(RegExp.$1, (key === 'q+' || key === 'E+') ? weeks[val] : (RegExp.$1.length === 1 ? val : ('00' + val).substr(val.length)))
      }
    })
    return result
  }
  return date
}

/**
  * 返回前几个月或后几个月的日期
  *
  * @param {Date} date 日期或数字
  * @param {String} mode 获取哪天(默认null)、月初(first)、月末(last)
  * @param {String} month 月(默认0)、前几个月(-数值)、后几个月(数值)
  * @return {Date}
  */
export function getWhatMonth (date, mode, month) {
  var currentDate = stringToDate(date)
  var number = month && !isNaN(month) ? month : 0
  var oldH = currentDate.getHours()
  var oldm = currentDate.getMinutes()
  var olds = currentDate.getSeconds()
  var oldS = currentDate.getMilliseconds()
  if (mode === 'first') {
    var oldY = currentDate.getFullYear()
    var oldM = currentDate.getMonth()
    if ((oldM += number) < 0) {
      return new Date(oldY - Math.ceil((oldM = Math.abs(oldM)) / 12), 12 - (oldM % 12 || 1), 1, oldH, oldm, olds, oldS)
    }
    return new Date(oldY + Math.floor(oldM / 12), oldM % 12, 1, oldH, oldm, olds, oldS)
  } else if (mode === 'last') {
    return new Date(getWhatMonth(currentDate, 'first', number + 1).getTime() - 86400000)
  }
  var oldD = currentDate.getDate()
  var dateTime = getWhatMonth(currentDate, 'first', number)
  var newM = dateTime.getMonth()
  dateTime.setDate(oldD)
  while (newM < dateTime.getMonth()) {
    dateTime.setDate(--oldD)
  }
  return dateTime
}

/**
  * 返回前几周或后几周的星期几
  *
  * @param {Date} date 日期
  * @param {Number} mode 星期天(默认0)、星期一(1)、星期二(2)、星期三(3)、星期四(4)、星期五(5)、星期六(6)
  * @param {String} week 周(默认0)、前几周(-数值)、后几周(数值)
  * @return {Date}
  */
export function getWhatWeek (date, mode, week) {
  var customDay = Number(/^[0-7]$/.test(mode) ? mode : 0)
  var currentDate = stringToDate(date)
  var currentDay = currentDate.getDay()
  var time = currentDate.getTime()
  var whatDayTime = time + ((customDay === 0 ? 7 : customDay) - (currentDay === 0 ? 7 : currentDay)) * 86400000
  if (week && !isNaN(week)) {
    whatDayTime += week * 604800000
  }
  return new Date(whatDayTime)
}

/**
  * 返回前几天或后几天的日期
  *
  * @param {Date} date 日期或数字
  * @param {String} day 天(默认0)、前几天(-数值)、后几天(数值)
  * @return {Date}
  */
export function getWhatDay (date, day) {
  return new Date(stringToDate(date).getTime() + (day && !isNaN(day) ? day * 86400000 : 0))
}

/**
  * 返回前几个月或后几个月的当月天数
  *
  * @param {Date} date 日期或数字
  * @param {String} month 月(默认0)、前几个月(-数值)、后几个月(数值)
  * @return {Number}
  */
export function getDaysOfMonth (date, month) {
  return Math.floor((getWhatMonth(date, 'last', month).getTime() - getWhatMonth(date, 'first', month).getTime()) / 86400000) + 1
}

/**
  * 返回两个日期之间差距
  *
  * @param {Date} startDate 开始日期
  * @param {Date} endDate 结束日期或当期日期
  * @param {Date} rule 自定义计算规则
  * @return {Object}
  */
export function getDateDiff (startDate, endDate, rules) {
  var result = {}
  var startTime = stringToDate(startDate).getTime()
  var endTime = endDate ? stringToDate(endDate).getTime() : new Date()
  if (startTime < endTime) {
    var item
    var diffTime = endTime - startTime
    var rule = rules && rules.length > 0 ? rules : [['yyyy', 31536000000], ['MM', 2592000000], ['dd', 86400000], ['HH', 3600000], ['mm', 60000], ['ss', 1000], ['S', 0]]
    for (let index = 0, len = rule.length; index < len; index++) {
      item = rule[index]
      if (diffTime >= item[1]) {
        if (index === len - 1) {
          if (diffTime) {
            result[item[0]] = diffTime
          }
        } else {
          result[item[0]] = Math.floor(diffTime / item[1])
          diffTime -= result[item[0]] * item[1]
        }
      }
    }
  }
  return result
}
