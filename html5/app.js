;(function (_this) {
  const { render } = JaxMustache
  const { loadData } = xUtils

  const XApp = function (el, data) {
    this.el = el
    this.data = data
    this.eventBus = new Map()
    this.components = new WeakMap()

    let elements = el.querySelectorAll('[data-import]')

    console.log(elements)
    // 初始化应用
    this.bootstrapApp = function () {
      // 生成事件总线
      this.bootstrapEventBus()
      // 生成公共函数
      this.bootstrapCommonMethod()
      // 加载组件列表
      for (let i = 0; i < elements.length; i++) {
        // 挂载组件
        this.mountComponent(elements[i])
      }
    }

    // 挂载组件到对应节点下
    this.mountComponent = async function (elm) {
      let importName = elm.dataset.import
      if (!importName) return
      let tempAll = await loadData(`./template/${importName}.html`)

      // 拿到模板字符串
      let tempHtml = tempAll.match(/\<template\>([\s\S]+?)\<\/template\>/)
      if (!tempHtml[1]) return
      tempHtml = tempHtml[1]

      // 拿到模板脚本字符串
      let tempScript = tempAll.match(/\<script\>([\s\S]+?)\<\/script\>/)
      tempScript = tempScript ? tempScript[1] : null

      let namespace = '_' + Math.random().toString().substring(2)
      let component = {
        tempHtml,
        tempScript,
        namespace,
        elm,
        data: {
          $emit: this.$emit,
          $on: this.$on,
          $forceUpdate: this.$forceUpdate,
          root: this.data,
        },
      }

      component.data._x_c = component

      // 拿到模板脚本
      let componentCtx = this.getContext(tempScript, component)
      // Object.assign(component.data, componentCtx || {})

      // 组件自己的数据结构，若不声明则为最外层传入的数据
      let _data = data
      if (componentCtx) {
        if (componentCtx.data) {
          // 就不判断是否是函数了
          let dataCxt = componentCtx.data.bind(component.data)()
          _data = {
            ...dataCxt,
            ...componentCtx,
          }
          component.data._x_data = dataCxt
          Reflect.deleteProperty(_data, 'data')
        } else {
          Object.assign(_data, componentCtx)
        }
      }

      // 方便起见，借助原生的事件机制，为事件执行函数绑定组件特有的命名空间
      Object.assign(component.data, _data)

      if (componentCtx && componentCtx.created) {
        componentCtx.created.bind(component.data)()
      }
      // console.log(component.data)
      _this[namespace] = component.data

      this.components.set(elm, component)

      // 得到渲染数据候后的模板字符串
      let tplstr = render(tempHtml, this.components.get(elm))
      elm.innerHTML = tplstr // 挂载
    }

    // 执行模板脚本字符串，得到返回值
    this.getContext = function (code, component) {
      // new Function时传入形参，这里并没有用到
      let func = new Function('_x_data', code)
      return func.bind(component.data)()
    }

    // 简单的事件总线
    this.bootstrapEventBus = function () {
      const xapp = this
      this.$emit = function (name, data) {
        if (xapp.eventBus.has(name)) {
          console.log(this)
          let handler = xapp.eventBus.get(name)
          handler[0].bind(handler[1])(data)
        }
      }
      this.$on = function (name, handler) {
        // 简单版，直接覆盖老的
        xapp.eventBus.set(name, [handler.bind(this), this])
      }
    }
    this.bootstrapCommonMethod = function () {
      this.$forceUpdate = function () {
        let tplstr = render(this._x_c.tempHtml, this._x_c)
        this._x_c.elm.innerHTML = tplstr // 挂载
      }
    }
    this.bootstrapApp()
  }

  _this.XApp = XApp
})(this)
