import React from 'react'
import ReactDom from 'react-dom'
import ReactDomClient from 'react-dom/client'
import JsxRuntime from 'react/jsx-runtime'
import  * as antd from 'antd'//为了方便导入所有的控件

System.set('app:react', { default: React, __useDefault: true })
System.set('app:react/jsx-runtime', { ...JsxRuntime })
System.set('app:react-dom', { default: ReactDom, __useDefault: true })
System.set('app:react-dom/client', { default: ReactDomClient, __useDefault: true })

System.set('app:antd',{...antd})//注册所有的antd控件

System.addImportMap({
	imports: {
		react: 'app:react',
		'react/jsx-runtime': 'app:react/jsx-runtime',
		'react-dom': 'app:react-dom',
		'react-dom/client': 'app:react-dom/client',
		'antd':'app:antd'//增加antd外部依赖的映射,只有这样，生成的远程控件才能找到对应的控件
	}
})
