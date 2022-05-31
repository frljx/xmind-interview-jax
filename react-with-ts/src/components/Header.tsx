import { Button, Form, Select } from 'antd'
import { useRef } from 'react'
const Header = () => {
  const [form] = Form.useForm()
  const months = useRef(['全部', ...new Array(12).fill(0).map((_, i) => i + 1)])
  return (
    <header>
      <Form
        layout='inline'
        form={form}
        initialValues={{ month: '全部', type: '全部', category: '全部' }}>
        <Form.Item label='月份' name='month'>
          <Select style={{ width: '140px' }}>
            {months.current.map((m) => (
              <Select.Option value={m} key={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='账单类型' name='type'>
          <Select style={{ width: '140px' }}>
            <Select.Option value='全部'>全部</Select.Option>
            <Select.Option value='1'>收入</Select.Option>
            <Select.Option value='0'>支出</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='账单分类' name='category'>
          <Select style={{ width: '140px' }}>
            <Select.Option value='全部'>全部</Select.Option>
            <Select.Option value='1'>收入</Select.Option>
            <Select.Option value='0'>支出</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Button type='primary'>新增账单</Button>
    </header>
  )
}

export default Header
