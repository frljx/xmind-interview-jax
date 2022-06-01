import { useCallback, useEffect, useState } from 'react'
import { IDataList } from '../interface'
import { thousands } from '../utils'

const Footer = (props: { bill: IDataList }) => {
  const [sum, setSum] = useState({ income: '', pay: '' })

  // 求和..
  const calcSum = useCallback((data: IDataList) => {
    let sum = { income: 0, pay: 0 }
    data.forEach((t) => {
      if (t.type === '1') {
        sum.income += +t.amount
      } else {
        sum.pay += +t.amount
      }
    })
    let income: string = thousands(sum.income + '')
    let pay: string = thousands(sum.pay + '')

    setSum({ income, pay })
  }, [])

  // 初始化时计算
  useEffect(() => {
    calcSum(props.bill)
  }, [props.bill])

  // 被main通知时计算
  useEffect(() => {
    PubSub.subscribe('search-done', (_, data) => {
      calcSum(data)
    })
    return () => {
      PubSub.unsubscribe('search-done')
    }
  }, [])
  return (
    <footer>
      其中收入：{sum.income}元，支出：{sum.pay}元
    </footer>
  )
}

export default Footer
