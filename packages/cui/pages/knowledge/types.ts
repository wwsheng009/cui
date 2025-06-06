// 知识库数据类型
export interface KnowledgeBase {
	id: string
	collection_id: string
	name: string
	description: string
	uid: string
	public: boolean
	scope?: any
	readonly: boolean
	option?: any
	system: boolean
	sort: number
	cover: string
	document_count: number // 文档数量
	created_at: string
	updated_at: string
}

export interface DocumentSummary {
	id: string
	collection_id: string
	doc_id: string // 文档ID
	uid: string // Creator
	name: string
	cover?: string
	description?: string
	created_at: string
	updated_at: string
	chunk_count: number // 切片数量
}

export interface Document {
	id: string
	doc_id: string // 文档ID
	collection_id: string
	name: string
	description: string
	uid: string
	cover?: string
	content: string
	created_at: string
	updated_at: string
}

export interface Chunk {
	id: string
	doc_id: string // 文档ID
	collection_id: string // 知识库ID
	content: string // 切片内容
	seek: number // 切片位置
	length: number // 切片长度
	created_at: string
	updated_at: string
}
