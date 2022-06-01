import { DatePicker, Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useCallback, useEffect, useState } from 'react'
import { IDataList } from '../interface'

const AddAmount = (props: { categories: IDataList; onAdd: Function }) => {
  const [visible, setVisible] = useState(false)
  const [form] = useForm()
  const { categories } = props
  const [cts, setCts] = useState(categories)

  useEffect(() => {
    setCts(categories)
    PubSub.subscribe('visible-add', (_, _v) => {
      setVisible(_v)
    })
    return () => {
      PubSub.unsubscribe('visible-add')
    }
  }, [categories])

  const handleChangeType = useCallback(
    (val: string) => {
      form.resetFields(['category'])
      setCts(categories.filter((c) => c.type === val))
    },
    [categories]
  )

  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        props.onAdd(values)
        form.resetFields()
        setVisible(false)
      })
      .catch(() => {})
  }, [categories])

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <Modal
      title='新增账单'
      visible={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{
          time: '',
          type: '',
          category: '',
          amount: '',
        }}
        autoComplete='off'>
        <Form.Item
          label='账单时间'
          name='time'
          rules={[{ required: true, message: '请选择账单时间' }]}>
          <DatePicker style={{ width: '100%' }} placeholder='账单时间' />
        </Form.Item>

        <Form.Item
          label='账单类型'
          name='type'
          rules={[{ required: true, message: '请选择账单类型' }]}>
          <Select onChange={handleChangeType} placeholder='账单类型'>
            <Select.Option value='1'>收入</Select.Option>
            <Select.Option value='0'>支出</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='账单分类'
          name='category'
          rules={[{ required: true, message: '请选择账单分类' }]}>
          <Select placeholder='账单分类'>
            {cts.map((c) => (
              <Select.Option value={c.id} key={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='账单金额'
          name='amount'
          rules={[{ required: true, message: '请填写账单金额' }]}>
          <Input type='number' placeholder='账单金额' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddAmount
