import React, { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { csv2list } from './utils'

// 加载资源
const billText = require('./bill.csv')
// const categoriesText = require('./static/categories.csv')

type DataList = Array<{ [name: string]: string }>

function App() {
  const [bill, setBill] = useState<DataList>([])
  const [categories, setCategories] = useState<DataList>([])

  useEffect(() => {
    const bootstrapApp = async () => {
      console.log(billText)
      let b = csv2list(billText)
      // let c = csv2list(categoriesText)
      setBill(b)
      // setCategories(c)
      console.log(b)
    }
    bootstrapApp()
  }, [])
  return (
    <div className='App'>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default App
