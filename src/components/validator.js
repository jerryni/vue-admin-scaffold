import _ from './utils'

export default {
  lengthLimit (title, length) {
    return (rule, value, callback) => {
      if (_.length(value) > length) {
        return callback(new Error(`${title}最多${length}字符`))
      } else {
        callback()
      }
    }
  },
  notEmpty (title) {
    return (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`${title}不能为空`))
      } else {
        callback()
      }
    }
  },
  emptyAndLengthLimit (title, length) {
    return (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`${title}不能为空`))
      } else {
        if (_.length(value) > length) {
          return callback(new Error(`${title}最多${length}字符`))
        } else {
          callback()
        }
      }
    }
  }
}
