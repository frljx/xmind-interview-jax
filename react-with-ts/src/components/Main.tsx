import { Table } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import PubSub from 'pubsub-js'
import { IDataItem, IDataList, ISearchParams } from '../interface'
import { ColumnsType } from 'antd/lib/table'

const Main = (props: { bill: IDataList }) => {
  const [mainHeight, setMainHeight] = useState(500)
  const [list, setList] = useState(props.bill)
  const ref = useRef<ISearchParams | null>(null)
  const columns: ColumnsType<IDataItem> = [
    { title: '账单时间', dataIndex: 'fmtTime', width: '25%' },
    { title: '账单类型', dataIndex: 'typeName', width: '25%' },
    { title: '账单分类', dataIndex: 'categoryName', width: '25%' },
    {
      title: '账单金额',
      dataIndex: 'fmtAmount',
      width: '25%',
      align: 'right',
      sorter: (a, b) => +a.amount - +b.amount,
    },
  ]

  const handleFilter = useCallback(() => {
    let bill = [...props.bill]
    if (ref.current === null) {
      setList(bill)
      return
    }
    let sp = ref.current as ISearchParams
    const { month, type, category } = sp
    bill =
      month === 0
        ? bill
        : bill.filter((t) => t.timeObj.getMonth() + 1 === +month)

    bill = bill.filter((t) => {
      return type === '全部' ? true : t.type === type
    })
    bill = bill.filter((t) => {
      return category === '全部' ? true : t.category === category
    })
    setList(bill)

    // 通知footer
    PubSub.publish('search-done', bill)
  }, [props.bill])

  // 初始化列表，并监听search事件
  useEffect(() => {
    handleFilter()
    PubSub.subscribe('search-change', (_, searchParams: ISearchParams) => {
      ref.current = searchParams
      handleFilter()
    })
    return () => {
      PubSub.unsubscribe('search-change')
    }
  }, [props.bill])

  // 为了固定表头，计算表格高度
  const measureRef = useCallback((node: HTMLElement) => {
    let height = node.offsetHeight
    setMainHeight(height - 55)
  }, [])
  return (
    <main ref={measureRef}>
      <Table
        dataSource={list}
        columns={columns}
        rowKey={(row) => row.time + '' + row.index}
        pagination={false}
        bordered={true}
        scroll={{ y: mainHeight }}
      />
    </main>
  )
}

export default Main
