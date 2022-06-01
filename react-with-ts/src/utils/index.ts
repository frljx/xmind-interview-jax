import { IDataList } from '../interface'
import bill from '../static/bill.csv'
import categories from '../static/categories.csv'

const service = {
  bill,
  categories,
}

type FetchName = 'bill' | 'categories'
export const fetchData = async (name: FetchName) => {
  let data = await fetch(service[name])
  let text = await data.text()
  return csv2list(text)
}

const csv2list = (text: string): Array<{ [name: string]: any }> => {
  let rows = text.split(/\s/g)
  let header = rows[0].split(',')
  let list = rows.map((rowText) => {
    let cols = rowText.split(',')
    let row: { [name: string]: string } = {}
    header.forEach((item, index) => (row[item] = cols[index]))
    return row
  })
  list.shift()
  return list
}

export const inject = (bill: IDataList, categories: IDataList) => {
  let cateMap = new Map(categories.map((c) => [c.id, c.name]))
  bill.forEach((b, i) => {
    b.typeName = b.type === '1' ? '收入' : '支出'
    b.categoryName = cateMap.get(b.category) || ''
    b.timeObj = new Date(+b.time)
    b.fmtTime = fmtDate(b.timeObj, 'yyyy-MM-dd hh:mm:ss')
    b.fmtAmount = thousands(b.amount as string)
    b.defaultSort = b.time
    b.index = i
  })
  return bill
}

export const fmtDate = function (date: string | Date, fmt: string) {
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
      ((date as Date).getFullYear() + '').substring(4 - $1.length)
    )
  }
  let o: { [name: string]: any } = {
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
export const thousands = (text: string, decimal = 2, not00 = false): string => {
  if (!text || !+text) {
    if ((+text).toString() !== 'NaN' && text !== null && text !== undefined) {
      if (text.length > 1) {
        return (+text).toFixed(decimal)
      }
    }
    if ((+text).toString() === 'NaN') {
      return '0'
    }
    return text
  }
  text = parseFloat(text).toFixed(decimal)
  let arr = text.toString().split('.')
  let behind = arr[1] ? ('.' + arr[1]).substring(0, 3) : ''
  if (not00) {
    if (behind === '.00') {
      behind = ''
    }
  }
  let res =
    (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + behind
  return (res === '0.00' || res === '-0.00' ? 0 : res) as string
}
