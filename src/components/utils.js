export default {
  urlParams (obj) {
    if (!obj) {
      return ''
    }

    return Object.keys(obj).map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
    }).join('&')
  },
  length (_str) {
    _str = _str + '' || ''
    return _str.replace(/[^\x00-\xff]/g, 'xx').length
  },

  // 过滤掉后端返回的null字段
  removeNull (obj) {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }

      if (obj[key] === null) {
        delete obj[key]
      }
    }

    return obj
  },
  getSeconds (date) {
    if (typeof date === 'number') {
      return Math.floor(date / 1000)
    }
    if (typeof date === 'string') {
      date = new Date(date)
    }
    return Math.floor(date.getTime() / 1000)
  },

  extractUrl (data) {
    let [, url] = /\("(.+)"\)/.exec(data)
    return url
  }
}
