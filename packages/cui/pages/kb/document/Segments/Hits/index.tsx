import React, { useState, useEffect } from 'react'
import { Typography, Button, Tooltip, Modal, message } from 'antd'
import { getLocale } from '@umijs/max'
import Icon from '@/widgets/Icon'

import { Segment } from '@/openapi/kb/types'
import { DataTable, DetailModal } from '@/pages/kb/components'
import { TableColumn, TableFilter, TableAction } from '@/pages/kb/components/DataTable/types'
import { DetailModalProps, DetailSection } from '@/pages/kb/components/DetailModal/types'
import { HitRecord } from '@/pages/kb/types'
import { mockListHits, ListHitsRequest } from './mockData'
import styles from '../detail.less'
import localStyles from './index.less'

const { Text } = Typography

// 简化的 JSON 高亮渲染组件
const JSONCode: React.FC<{ data: any }> = ({ data }) => {
	const jsonString = JSON.stringify(data, null, 2)

	// 使用正则表达式进行简单的语法高亮
	const highlightedJSON = jsonString
		.replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
		.replace(/:\s*"([^"]*)"/g, ': <span class="json-string">"$1"</span>')
		.replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
		.replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
		.replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')

	return (
		<div className={localStyles.contextCode}>
			<pre dangerouslySetInnerHTML={{ __html: highlightedJSON }} />
		</div>
	)
}

interface HitsData {
	totalHits: number
	hitsByScenario: {
		[key: string]: number
	}
}

interface HitsViewProps {
	segmentData: Segment
}

const HitsView: React.FC<HitsViewProps> = ({ segmentData }) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const [hitsData, setHitsData] = useState<HitsData | null>(null)
	const [loading, setLoading] = useState(true)
	const [tableData, setTableData] = useState<HitRecord[]>([])
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0
	})
	const [filters, setFilters] = useState<Record<string, any>>({})
	const [hasMore, setHasMore] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [detailVisible, setDetailVisible] = useState(false)
	const [selectedRecord, setSelectedRecord] = useState<HitRecord | null>(null)

	useEffect(() => {
		loadHitsData()
		loadTableData()
	}, [segmentData.id])

	const loadHitsData = async () => {
		try {
			setLoading(true)
			// 模拟API请求延时
			await new Promise((resolve) => setTimeout(resolve, 100))

			// 模拟命中数据
			const mockData: HitsData = {
				totalHits: 30, // 更新为实际的数据量
				hitsByScenario: {
					智能问答: 12,
					文档检索: 11,
					知识推荐: 7
				}
			}

			setHitsData(mockData)
		} catch (error) {
			console.error('Failed to load hits data:', error)
		} finally {
			setLoading(false)
		}
	}

	const loadTableData = async (params?: Partial<ListHitsRequest>, isLoadMore = false) => {
		try {
			if (!isLoadMore) {
				setLoading(true)
				setTableData([]) // 重新搜索时清空数据
				setPagination((prev) => ({ ...prev, current: 1 }))
			} else {
				setLoadingMore(true)
			}

			const currentPage = isLoadMore ? pagination.current + 1 : 1
			const request: ListHitsRequest = {
				page: currentPage,
				pagesize: 10, // 每页10条
				...filters,
				...params
			}

			const response = await mockListHits(request)

			if (isLoadMore) {
				// 追加数据
				setTableData((prev) => [...prev, ...response.data])
				setPagination((prev) => ({
					...prev,
					current: currentPage,
					total: response.total
				}))
			} else {
				// 替换数据
				setTableData(response.data)
				setPagination((prev) => ({
					...prev,
					total: response.total,
					current: 1
				}))
			}

			// 检查是否还有更多数据 - 计算总页数
			const totalPages = Math.ceil(response.total / request.pagesize!)
			setHasMore(currentPage < totalPages)

			console.log('📋 Hits Data Debug:', {
				currentPage,
				totalPages,
				total: response.total,
				pagesize: request.pagesize,
				dataLength: response.data.length,
				hasMore: currentPage < totalPages
			})
		} catch (error) {
			console.error('Failed to load hits table data:', error)
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}

	// 加载更多数据
	const handleLoadMore = () => {
		if (!loadingMore && hasMore) {
			loadTableData(undefined, true)
		}
	}

	// 定义表格列（设置合理的宽度）
	const columns: TableColumn<HitRecord>[] = [
		{
			key: 'scenario',
			title: is_cn ? '场景' : 'Scenario',
			dataIndex: 'scenario',
			width: 120,
			render: (scenario: string) => <span className={localStyles.scenarioTag}>{scenario}</span>
		},
		{
			key: 'source',
			title: is_cn ? '来源' : 'Source',
			dataIndex: 'source',
			width: 140,
			render: (source: string) => <span className={localStyles.sourceText}>{source}</span>
		},
		{
			key: 'query',
			title: is_cn ? '查询内容' : 'Query',
			dataIndex: 'query',
			width: 250,
			ellipsis: true,
			render: (query: string) => (
				<Tooltip title={query}>
					<span className={localStyles.queryText}>{query || '-'}</span>
				</Tooltip>
			)
		},
		{
			key: 'context',
			title: 'Context',
			dataIndex: 'context',
			width: 300,
			render: (context: any) => <JSONCode data={context} />
		},
		{
			key: 'created_at',
			title: is_cn ? '创建时间' : 'Created At',
			dataIndex: 'created_at',
			width: 180,
			render: (date: string) => (
				<span className={localStyles.timestamp}>
					{new Date(date).toLocaleString(is_cn ? 'zh-CN' : 'en-US')}
				</span>
			)
		}
	]

	// 定义筛选器
	const tableFilters: TableFilter[] = [
		{
			key: 'scenario',
			label: is_cn ? '场景' : 'Scenario',
			type: 'select',
			options: [
				{ label: is_cn ? '智能问答' : 'Q&A', value: '智能问答' },
				{ label: is_cn ? '文档检索' : 'Document Search', value: '文档检索' },
				{ label: is_cn ? '知识推荐' : 'Recommendation', value: '知识推荐' }
			],
			onChange: (value) => {
				setFilters((prev) => ({ ...prev, scenario: value }))
				setHasMore(true) // 重置加载状态
				loadTableData({ scenario: value })
			}
		},
		{
			key: 'source',
			label: is_cn ? '来源' : 'Source',
			type: 'select',
			options: [
				{ label: 'Web Chat', value: 'web_chat' },
				{ label: 'API Call', value: 'api_call' },
				{ label: 'Mobile App', value: 'mobile_app' },
				{ label: 'Slack Bot', value: 'slack_bot' },
				{ label: 'Discord Bot', value: 'discord_bot' },
				{ label: 'VS Code', value: 'vscode_extension' }
			],
			onChange: (value) => {
				setFilters((prev) => ({ ...prev, source: value }))
				setHasMore(true) // 重置加载状态
				loadTableData({ source: value })
			}
		}
	]

	// 打开详情弹窗
	const handleViewDetails = (record: HitRecord) => {
		setSelectedRecord(record)
		setDetailVisible(true)
	}

	// 关闭详情弹窗
	const handleCloseDetails = () => {
		setDetailVisible(false)
		setSelectedRecord(null)
	}

	// 处理删除
	const handleDelete = async (record: HitRecord) => {
		try {
			// TODO: 实现实际的删除 API 调用
			console.log('Deleting hit record:', record)

			// 模拟删除操作
			await new Promise((resolve) => setTimeout(resolve, 500))

			// 从本地状态中移除
			setTableData((prevData) => prevData.filter((item) => item.id !== record.id))
			setPagination((prev) => ({ ...prev, total: prev.total - 1 }))

			message.success(is_cn ? '删除成功' : 'Deleted successfully')
		} catch (error) {
			console.error('Delete failed:', error)
			message.error(is_cn ? '删除失败' : 'Delete failed')
		}
	}

	// 定义操作按钮
	const actions: TableAction<HitRecord>[] = [
		{
			key: 'view',
			label: is_cn ? '查看详情' : 'View Details',
			icon: <Icon name='material-visibility' size={14} />,
			onClick: (record) => {
				handleViewDetails(record)
			}
		},
		{
			key: 'delete',
			label: is_cn ? '删除' : 'Delete',
			icon: <Icon name='material-delete' size={14} />,
			type: 'text',
			onClick: (record) => {
				// 使用 Modal.confirm 来显示确认对话框
				Modal.confirm({
					title: is_cn ? '确认删除' : 'Confirm Delete',
					content: is_cn
						? '确定要删除这条命中记录吗？删除后将无法恢复！'
						: 'Are you sure to delete this hit record? This action cannot be undone!',
					okText: is_cn ? '确认' : 'Confirm',
					cancelText: is_cn ? '取消' : 'Cancel',
					okType: 'danger',
					onOk: () => handleDelete(record)
				})
			}
		}
	]

	// 处理搜索
	const handleSearch = (value: string) => {
		setFilters((prev) => ({ ...prev, keywords: value }))
		setHasMore(true) // 重置加载状态
		loadTableData({ keywords: value })
	}

	// 配置详情弹窗的字段
	const detailSections: DetailSection[] = [
		{
			title: is_cn ? '基本信息' : 'Basic Information',
			fields: [
				{
					key: 'id',
					label: 'ID',
					value: selectedRecord?.id,
					span: 12,
					copyable: true
				},
				{
					key: 'scenario',
					label: is_cn ? '场景' : 'Scenario',
					value: selectedRecord?.scenario,
					span: 12,
					type: 'tag'
				},
				{
					key: 'source',
					label: is_cn ? '来源' : 'Source',
					value: selectedRecord?.source,
					span: 12,
					type: 'tag'
				},
				{
					key: 'created_at',
					label: is_cn ? '创建时间' : 'Created At',
					value: selectedRecord?.created_at,
					span: 12,
					type: 'time'
				}
			]
		},
		{
			title: is_cn ? '查询信息' : 'Query Information',
			fields: [
				{
					key: 'query',
					label: is_cn ? '查询内容' : 'Query',
					value: selectedRecord?.query,
					span: 24,
					copyable: true
				},
				{
					key: 'score',
					label: is_cn ? '匹配得分' : 'Match Score',
					value: selectedRecord?.score,
					span: 12,
					render: (value) => (value ? `${(value * 100).toFixed(2)}%` : '-')
				}
			]
		},
		{
			title: 'Context',
			collapsible: true,
			fields: [
				{
					key: 'context',
					label: 'Context Data',
					value: selectedRecord?.context,
					span: 24,
					type: 'json'
				}
			]
		}
	]

	return (
		<div className={styles.tabContent}>
			{/* Header - 与Editor一致的结构 */}
			<div className={`${styles.tabHeader} ${localStyles.cardHeader}`}>
				<div className={localStyles.chunkMeta}>
					<span className={localStyles.chunkNumber}>
						{segmentData.metadata?.chunk_details?.depth !== undefined &&
						segmentData.metadata?.chunk_details?.index !== undefined ? (
							<>
								<span className={localStyles.levelInfo}>
									<Icon name='material-account_tree' size={10} />
									{segmentData.metadata.chunk_details.depth}
								</span>
								<span>#{segmentData.metadata.chunk_details.index + 1}</span>
							</>
						) : (
							`#${segmentData.id.slice(-8)}`
						)}
					</span>
				</div>
				<div className={localStyles.metaInfo}>
					<span className={localStyles.metaItem}>
						{is_cn ? '总命中' : 'Total Hits'}{' '}
						<span className={localStyles.metaNumber}>{hitsData?.totalHits || 0}</span>
					</span>
					<span className={localStyles.metaItem}>
						{is_cn ? '场景数' : 'Scenarios'}{' '}
						<span className={localStyles.metaNumber}>
							{Object.keys(hitsData?.hitsByScenario || {}).length}
						</span>
					</span>
				</div>
			</div>

			{/* Body - 表格内容 */}
			<div className={styles.tableContainer}>
				<DataTable<HitRecord>
					data={tableData}
					columns={columns}
					loading={loading}
					total={pagination.total} // 传递总记录数
					columnWidthPreset='normal' // 使用预设的列宽配置
					autoFitColumns={true} // 自动适应容器宽度
					pagination={false} // 禁用分页器，使用滚动
					filters={tableFilters}
					searchPlaceholder={is_cn ? '搜索查询内容...' : 'Search queries...'}
					onSearch={handleSearch}
					actions={actions}
					size='small'
					scroll={{ x: 'max-content' }} // 只设置水平滚动，垂直滚动由CSS控制
					hasMore={hasMore} // 是否还有更多数据
					onLoadMore={handleLoadMore} // 加载更多回调
					loadingMore={loadingMore} // 加载状态
				/>
			</div>

			{/* 详情弹窗 */}
			<DetailModal<HitRecord>
				visible={detailVisible}
				onClose={handleCloseDetails}
				title={is_cn ? '命中记录详情' : 'Hit Record Details'}
				data={selectedRecord}
				sections={detailSections}
				width='60%'
				size='middle'
			/>
		</div>
	)
}

export default HitsView
