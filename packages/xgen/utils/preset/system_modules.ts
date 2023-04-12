import 'systemjs/dist/extras/amd'
import 'systemjs/dist/extras/use-default'

import {
	useAsyncEffect,
	useClickAway,
	useDeepCompareEffect,
	useFullscreen,
	useKeyPress,
	useMemoizedFn,
	useMount,
	useSize,
	useToggle,
	useUpdateEffect
} from 'ahooks'
import { Button, ConfigProvider, Drawer, Form, Input, Popover } from 'antd'
import axios from 'axios'
import { cx } from 'classix'
import Emittery from 'emittery'
import { deepEqual } from 'fast-equals'
import { autorun, configure, makeAutoObservable, reaction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactDomClient from 'react-dom/client'
import * as JsxRuntime from 'react/jsx-runtime'
import { createMakeAndWithStyles } from 'tss-react'
import { container, injectable, singleton } from 'tsyringe'

import { Graph, Markup } from '@antv/x6'
import { Scroller } from '@antv/x6-plugin-scroller'
import { register } from '@antv/x6-react-shape'

System.set('app:react', { default: React, ...React })
System.set('app:react-dom', { default: ReactDom, ...ReactDom })
System.set('app:react-dom/client', { default: ReactDomClient, ...ReactDomClient })
System.set('app:react/jsx-runtime', { ...JsxRuntime })

System.set('app:axios', { default: axios })
System.set('app:emittery', { default: Emittery })
System.set('app:nanoid', { nanoid })
System.set('app:classix', { cx })
System.set('app:tss-react', { createMakeAndWithStyles })
System.set('app:fast-equals', { deepEqual })

System.set('app:tsyringe', { container, injectable, singleton })
System.set('app:mobx', { toJS, makeAutoObservable, reaction, autorun, configure })
System.set('app:mobx-react-lite', { observer })

System.set('app:@antv/x6', { Graph, Markup })
System.set('app:@antv/x6-react-shape', { register })
System.set('app:@antv/x6-plugin-scroller', { Scroller })

System.set('app:antd', { Input, Form, Drawer, Popover, Button, ConfigProvider })
System.set('app:ahooks', {
	useMemoizedFn,
	useClickAway,
	useFullscreen,
	useToggle,
	useMount,
	useDeepCompareEffect,
	useKeyPress,
	useAsyncEffect,
	useSize,
	useUpdateEffect
})
import * as Antd from 'antd' //为了方便导入所有的控件
import * as Ahooks from 'ahooks'
System.set('app:antd', { ...Antd })
System.set('app:ahooks', { ...Ahooks })

System.addImportMap({
	imports: [
		'react',
		'react-dom',
		'react-dom/client',
		'react/jsx-runtime',

		'axios',
		'emittery',
		'nanoid',
		'classix',
		'tss-react',
		'fast-equals',

		'tsyringe',
		'mobx',
		'mobx-react-lite',

		'@antv/x6',
		'@antv/x6-react-shape',
		'@antv/x6-plugin-scroller',

		'antd',
		'ahooks'
	].reduce((total, item) => {
		total[item] = `app:${item}`

		return total
	}, {} as Record<string, string>)
})
