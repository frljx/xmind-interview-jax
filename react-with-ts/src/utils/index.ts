export const csv2list = (text: string): Array<{ [name: string]: string }> => {
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
