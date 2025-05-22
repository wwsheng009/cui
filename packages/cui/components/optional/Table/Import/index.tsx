import { Button, Modal, Tabs, Tooltip } from 'antd'
import axios from 'axios'
import clsx from 'clsx'
import { Fragment, useEffect, useState } from 'react'

import { useAction } from '@/actions'
import { Icon } from '@/widgets'
import { UploadOutlined } from '@ant-design/icons'

import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import Steps from './components/Steps'
import styles from './index.less'

const { confirm } = Modal

import type { ModalProps } from 'antd'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { api, actions, search } = props
	const [visible_modal, setVisibleModal] = useState(false)
	const [setting, setSetting] = useState<any>({})
	const [step, setStep] = useState(0)
	const [file_name, setFileName] = useState('')
	const [preview_payload, setPreviewPayload] = useState<any>({})
	const onAction = useAction()

	const getSetting = async () => {
		const setting = await axios.get(api.setting)

		setSetting(setting)
	}

	useEffect(() => {
		getSetting()
	}, [api])

	useEffect(() => {
		if (visible_modal) return

		setStep(0)
		setFileName('')
		setPreviewPayload({})
	}, [visible_modal])

	const props_modal: ModalProps = {
		open: visible_modal,
		centered: true,
		width: 900,
		footer: false,
		closable: false,
		zIndex: 1000,
		maskClosable: false,
		destroyOnClose: true,
		bodyStyle: { padding: 0 },
		wrapClassName: styles.custom_modal,
		onCancel: () => setVisibleModal(false)
	}

	const next = () => {
		if (step < 3) {
			setStep(step + 1)
		}

		if (step === 3) {
			search()
			setVisibleModal(false)
		}
	}

	const items = [
		{
			label: 0,
			key: '0',
			children: <Step1 {...{ file_name, setFileName, next }}></Step1>
		},
		{
			label: 0,
			key: '1',
			children: (
				<Step2
					{...{
						api,
						file_name,
						setPreviewPayload
					}}
				></Step2>
			)
		},
		{
			label: 0,
			key: '2',
			children: <Step3 {...{ api, preview_payload }}></Step3>
		},
		{
			label: 0,
			key: '3',
			children: <Step4 {...{ api, preview_payload }}></Step4>
		}
	]

	return (
		<Fragment>
			<Tooltip title={setting.title ?? '导入'} placement='bottom'>
				<a
					className='option_item cursor_point flex justify_center align_center transition_normal clickable'
					onClick={() => setVisibleModal(true)}
				>
					<UploadOutlined className='icon_option' style={{ fontSize: 17 }} />
				</a>
			</Tooltip>
			<Modal {...props_modal}>
				<div className='header_wrap w_100 border_box flex justify_between align_center'>
					<span className='title'>{setting.title ?? '导入'}</span>
					<div className='action_items flex'>
						{actions && actions?.length > 0 && (
							<div className='custom_actions flex align_center'>
								{actions?.map((it, index) => (
									<Button
										className={clsx([
											'btn_action border_box flex justify_center align_center clickable'
										])}
										icon={<Icon name={it.icon} size={15}></Icon>}
										key={index}
										onClick={() =>
											onAction({
												namespace: '',
												primary: '',
												data_item: null,
												it
											})
										}
									>
										{it.title}
									</Button>
								))}
							</div>
						)}
						{step < 3 && (
							<Button
								className='btn btn_close'
								icon={<Icon name='icon-arrow-left' size={15}></Icon>}
								onClick={() => {
									confirm({
										title: '确认取消导入?',
										onOk() {
											setVisibleModal(false)
										}
									})
								}}
							>
								取消
							</Button>
						)}
						{step > 0 && step < 3 && (
							<Button className='btn ml_16' onClick={() => setStep(step - 1)}>
								上一步
							</Button>
						)}
						<Button className='btn ml_16' type='primary' disabled={step === 0} onClick={next}>
							{step === 3 ? '完成' : '下一步'}
						</Button>
					</div>
				</div>
				<div className={clsx([styles._local, 'custom_wrap w_100 border_box flex flex_column'])}>
					<Steps {...{ step }}></Steps>
					<Tabs activeKey={`${step}`} renderTabBar={undefined} animated items={items}></Tabs>
				</div>
			</Modal>
		</Fragment>
	)
}

export default window.$app.memo(Index)
