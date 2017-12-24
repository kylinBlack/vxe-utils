export function XEUtils () {}

Object.assign(XEUtils, {

  context: window,

  /**
   * 函数扩展
   *
   * @param {Object} methods 扩展函数对象
   */
  mixin (methods) {
    Object.keys(methods).forEach(function (name) {
      var fn = methods[name]
      XEUtils[name] = typeof fn === 'function' ? function () {
        var rest = fn.apply(XEUtils.context || window, arguments)
        XEUtils.context = window
        return rest
      } : fn
    })
  }
})
