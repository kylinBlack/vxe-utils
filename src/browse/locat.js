const $locat = location

function hash () {
  return ($locat.hash.split('#')[1] || '').split('?')[0] || ''
}

function parse (uri) {
  var result = {}
  let params = uri.split('?')[1] || ''
  params.split('&').forEach(param => {
    let [key, val] = param.split('=')
    result[decodeURIComponent(key)] = val ? decodeURIComponent(val) : val
  })
  return result
}

/**
 * 获取地址栏信息
  * @return Object
 */
export function locat () {
  return {
    port: $locat.port,
    href: $locat.href,
    host: $locat.host,
    hostname: $locat.hostname,
    protocol: $locat.protocol,
    origin: $locat.origin,
    hash: hash(),
    query: parse($locat.hash),
    params: parse($locat.search)
  }
}
