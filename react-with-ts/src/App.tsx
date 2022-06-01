import React, { useCallback, useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import AddAmount from './components/AddAmount'
import { fetchData, inject } from './utils'
import { IDataItem, IDataList } from './interface'

function App() {
  const [bill, setBill] = useState<IDataList>([])
  const [categories, setCategories] = useState<IDataList>([])

  useEffect(() => {
    const bootstrapApp = async () => {
      // 模拟异步请求
      let b = await fetchData('bill')
      let c = await fetchData('categories')
      b = inject(b, c)
      setBill(b)
      setCategories(c)
    }
    bootstrapApp()
  }, [])
  const handleAdd = useCallback(
    function (values: IDataItem) {
      // 使用回调的方式获取最新的账单
      setBill((pre) => {
        let item = inject([values], categories)
        return [...pre, ...item]
      })
    },
    [categories]
  )

  return (
    <div className='App'>
      <Header bill={bill} categories={categories} />
      <Main bill={bill} />
      <Footer bill={bill} />
      <AddAmount
        categories={categories}
        onAdd={(values: IDataItem) => handleAdd(values)}
      />
    </div>
  )
}

export default App
