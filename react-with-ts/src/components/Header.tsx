import { Button, Form, Select } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'

import PubSub from 'pubsub-js'
import { IDataList } from '../interface'

const Header = (props: { bill: IDataList; categories: IDataList }) => {
  const [form] = Form.useForm()
  const [cts, setCts] = useState(props.categories)

  // 生成月份
  const months = useRef([...new Array(12).fill(0).map((_, i) => i + 1)])

  // 执行检索 - 通知main
  const search = useCallback(() => {
    const searchParams = form.getFieldsValue(['month', 'type', 'category'])
    PubSub.publish('search-change', searchParams)
  }, [])

  // 账单类型切换
  const handleChangeType = useCallback(
    (val: string) => {
      form.resetFields(['category'])
      setCts(
        props.categories.filter((c) => (val === '全部' ? true : c.type === val))
      )
      search()
    },
    [props.categories]
  )

  // 初始化账单分类
  useEffect(() => {
    setCts([...props.categories])
  }, [props.categories])

  return (
    <header>
      <Form
        layout='inline'
        form={form}
        initialValues={{ month: 0, type: '全部', category: '全部' }}>
        <Form.Item label='月份' name='month'>
          <Select style={{ width: '140px' }} onChange={search}>
            <Select.Option value={0}>全部</Select.Option>
            {months.current.map((m) => (
              <Select.Option value={m} key={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='账单类型' name='type'>
          <Select style={{ width: '140px' }} onChange={handleChangeType}>
            <Select.Option value='全部'>全部</Select.Option>
            <Select.Option value='1'>收入</Select.Option>
            <Select.Option value='0'>支出</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='账单分类' name='category'>
          <Select style={{ width: '140px' }} onChange={search}>
            <Select.Option value='全部'>全部</Select.Option>
            {cts.map((c) => (
              <Select.Option value={c.id} key={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Button
        type='primary'
        onClick={() => PubSub.publish('visible-add', true)}>
        新增账单
      </Button>
    </header>
  )
}

export default Header
