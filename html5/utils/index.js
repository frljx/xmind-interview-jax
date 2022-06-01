;(function (_this) {
  let xUtils = (_this.xUtils = {})

  // 格式化日期
  xUtils.fmtDate = function (date, fmt) {
    if (typeof date === 'string' && date.indexOf('T') > -1) {
      date = new Date(date.replace('T', ' '))
    } else if ((date + '').length === 13) {
      date = new Date(+date)
    } else if (typeof date === 'string') {
      return date
    } else if (!date) {
      return ''
    }
    fmt = fmt || 'yyyy-MM-dd'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(/(y+)/, (_, $1) =>
        (date.getFullYear() + '').substring(4 - $1.length)
      )
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }
    for (let k in o) {
      let reg = new RegExp(`(${k})`)
      if (reg.test(fmt)) {
        fmt = fmt.replace(reg, (_, $1) =>
          $1.length === 1 ? o[k] + '' : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }

  // 千分位
  xUtils.thousands = (text, decimal = 2, not00 = false) => {
    if (!text || !+text) {
      if ((+text).toString() !== 'NaN' && text !== null && text !== undefined) {
        if (text.length > 1) {
          return (+text).toFixed(decimal)
        }
      }
      if ((+text).toString() === 'NaN') {
        return 0
      }
      return text
    }
    text = parseFloat(text).toFixed(decimal)
    text = text.toString().split('.')
    let behind = text[1] ? ('.' + text[1]).substring(0, 3) : ''
    if (not00) {
      if (behind === '.00') {
        behind = ''
      }
    }
    let res =
      (text[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + behind
    return res === '0.00' || res === '-0.00' ? 0 : res
  }

  // 加载csv数据源
  xUtils.loadData = async (url) => {
    let data = await fetch(url)
    return data.text()
  }

  // 将数据换转换成list
  xUtils.toList = (text) => {
    let rows = text.split(/\s/g)
    let header = rows[0].split(',')
    let list = rows.map((rowText) => {
      let cols = rowText.split(',')
      let row = {}
      header.forEach((item, index) => (row[item] = cols[index]))
      return row
    })
    list.shift()
    return list
  }

  // 将categories注入bill，并格式化部分数据
  xUtils.inject = (bill, categories) => {
    let cateMap = new Map(categories.map((c) => [c.id, c.name]))
    bill.forEach((b, i) => {
      b.typeName = b.type === '1' ? '收入' : '支出'
      b.categoryName = cateMap.get(b.category) || ''
      b.timeObj = new Date(+b.time)
      b.fmtTime = xUtils.fmtDate(b.timeObj, 'yyyy-MM-dd hh:mm:ss')
      b.fmtAmount = xUtils.thousands(b.amount)
      b.defaultSort = bill.length > 1 ? i : b.time
    })
  }
})(window)
