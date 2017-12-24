import { random } from './number'
import { isFunction, isArray, each, values } from './base'

/**
  * 数组去重
  *
  * @param {Array} array 数组
  * @return {Array}
  */
export function uniq (array) {
  var result = []
  if (isArray(array)) {
    array.forEach(function (value) {
      if (!result.includes(value)) {
        result.push(value)
      }
    })
  }
  return result
}

/**
  * 将多个数的值返回唯一的并集数组
  *
  * @param {...Array} 数组
  * @return {Array}
  */
export function union () {
  var result = []
  for (var array of arguments) {
    result = result.concat(array)
  }
  return uniq(result)
}

/**
  * 数组按属性值升序
  *
  * @param {Array} arr 数组
  * @param {Function, String} callback 方法或属性
  * @return {Array}
  */
export function sort (arr, callback, context) {
  if (isArray(arr)) {
    return arr.sort(callback ? isFunction(callback) ? callback.bind(context || this) : function (v1, v2) {
      return v1[callback] > v2[callback] ? 1 : -1
    } : function (v1, v2) {
      return v1 > v2 ? 1 : -1
    })
  }
  return arr
}

/**
  * 将一个数组随机打乱，返回一个新的数组
  *
  * @param {Array} array 数组
  * @return {Array}
  */
export function shuffle (array) {
  var result = []
  for (var list = values(array), len = list.length - 1; len >= 0; len--) {
    var index = len > 0 ? random(0, len) : 0
    result.push(list[index])
    list.splice(index, 1)
  }
  return result
}

/**
  * 从一个数组中随机返回几个元素
  *
  * @param {Array} array 数组
  * @param {Number} number 个数
  * @return {Array}
  */
export function sample (array, number) {
  var result = shuffle(array)
  if (arguments.length === 1) {
    return result[0]
  }
  if (number < result.length) {
    result.length = number || 0
  }
  return result
}

/**
  * 对象中的值中的每一项运行给定函数,如果函数对任一项返回true,则返回true,否则返回false
  *
  * @param {Object} obj 对象/数组
  * @param {Function} callback(item, index, obj) 回调
  * @param {Object} context 上下文(this默认指向当前vue组件)
  * @return {Boolean}
  */
export function some (obj, callback, context) {
  if (obj) {
    context = context || this
    if (isArray(obj)) {
      return obj.some(callback, context)
    } else {
      for (var index in obj) {
        if (obj.hasOwnProperty(index)) {
          if (callback.call(context, obj[index], index, obj)) {
            return true
          }
        }
      }
    }
  }
  return false
}

/**
  * 对象中的值中的每一项运行给定函数,如果该函数对每一项都返回true,则返回true,否则返回false
  *
  * @param {Object} obj 对象/数组
  * @param {Function} callback(item, index, obj) 回调
  * @param {Object} context 上下文(this默认指向当前vue组件)
  * @return {Boolean}
  */
export function every (obj, callback, context) {
  if (obj) {
    context = context || this
    if (isArray(obj)) {
      return obj.every(callback, context)
    } else {
      for (var index in obj) {
        if (obj.hasOwnProperty(index)) {
          if (!callback.call(context, obj[index], index, obj)) {
            return false
          }
        }
      }
    }
  }
  return true
}

/**
  * 根据回调过滤数据
  *
  * @param {Object} obj 对象/数组
  * @param {Function} callback(item, index, obj) 回调
  * @param {Object} context 上下文(this默认指向当前vue组件)
  * @return {Object}
  */
export function filter (obj, callback, context) {
  if (obj) {
    context = context || this
    if (isArray(obj)) {
      return obj.filter(callback, context)
    } else {
      var result = {}
      each(obj, function (val, key) {
        if (callback.call(context, val, key, obj)) {
          result[key] = val
        }
      })
      return result
    }
  }
  return []
}

/**
  * 查找匹配第一条数据
  *
  * @param {Object} obj 对象/数组
  * @param {Function} callback(item, index, obj) 回调
  * @param {Object} context 上下文(this默认指向当前vue组件)
  * @return {Object}
  */
export function find (obj, callback, context) {
  if (obj) {
    context = context || this
    if (isArray(obj)) {
      return obj.find(callback, context)
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (callback.call(context, obj[key], key, obj)) {
            return obj[key]
          }
        }
      }
    }
  }
}

/**
  * 指定方法后的返回值组成的新数组
  *
  * @param {Object} obj 对象/数组
  * @param {Function} callback(item, index, obj) 回调
  * @param {Object} context 上下文(this默认指向当前vue组件)
  * @return {Array}
  */
export function map (obj, callback, context) {
  var result = []
  if (obj) {
    context = context || this
    if (isArray(obj)) {
      return obj.map(callback, context)
    } else {
      each(obj, function () {
        result.push(callback.call(context, arguments))
      })
    }
  }
  return result
}
