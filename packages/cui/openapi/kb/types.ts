// Base collection metadata structure
export interface CollectionMetadata {
	name: string
	description: string
	uid: string
	readonly: boolean
	system: boolean
	sort: number
	cover: string
	document_count: number
	created_at: string
	updated_at: string
	// Permission fields (consistent with Model resources)
	__yao_created_by?: string // Created By User ID
	__yao_updated_by?: string // Updated By User ID
	__yao_team_id?: string // Team ID
	__yao_tenant_id?: string // Tenant ID
	__yao_public_read?: boolean // Public Read Permission
	__yao_public_write?: boolean // Public Write Permission
	__yao_inherit_from?: string // Inherit Permission From Parent Resource ID
	[key: string]: any // Additional fields
}

// Base collection config structure
export interface CollectionConfig {
	embedding_provider_id: string
	embedding_option_id: string
	locale?: string
	distance: string
	index_type: string
	// Additional HNSW parameters
	m?: number
	ef_construction?: number
	ef_search?: number
	// Additional IVF parameters
	num_lists?: number
	num_probes?: number
}

// Collection data structure (maps to backend GetCollections response)
export interface Collection {
	id: string
	metadata: CollectionMetadata
	config?: CollectionConfig
}

// API request types
export interface CreateCollectionRequest {
	id: string
	metadata?: Partial<CollectionMetadata>
	config: CollectionConfig
}

export interface GetCollectionsRequest {
	filter?: Record<string, string>
}

export interface UpdateCollectionMetadataRequest {
	metadata: Record<string, any>
}

// API response types
export interface CreateCollectionResponse {
	message: string
	collection_id: string
}

export interface RemoveCollectionResponse {
	message: string
	collection_id: string
	removed: boolean
}

export interface CollectionExistsResponse {
	collection_id: string
	exists: boolean
}

export interface UpdateCollectionMetadataResponse {
	message: string
	collection_id: string
}

// ===== Provider Management Types =====

// Re-export provider types from the Provider component
export type { Provider, ProviderSchema } from '../../pages/kb/components/Provider/types'

// Provider API request types
export interface GetProvidersRequest {
	providerType: string
	ids?: string // comma-separated list of provider IDs to filter
	locale?: string // locale for internationalization, defaults to 'en'
}

export interface GetProviderSchemaRequest {
	providerType: string
	providerID: string
	locale?: string // locale for internationalization, defaults to 'en'
}

// ===== Document Management Types =====

// Provider configuration for document operations
export interface ProviderConfig {
	provider_id: string
	option_id?: string
	option?: Record<string, any>
}

// 简化的集合信息，用于向下传递
export interface CollectionInfo {
	id: string
	name: string
	description?: string
	// Embedding provider 配置
	embedding_provider: string
	embedding_option: string
}

// Base request for document upsert operations
export interface BaseUpsertRequest {
	collection_id: string
	locale?: string
	chunking?: ProviderConfig
	embedding: ProviderConfig
	extraction?: ProviderConfig
	fetcher?: ProviderConfig
	converter?: ProviderConfig
	doc_id?: string
	metadata?: Record<string, any>
}

// Document management request types
export interface AddFileRequest extends BaseUpsertRequest {
	file_id: string
	uploader?: string
}

export interface AddTextRequest extends BaseUpsertRequest {
	text: string
}

export interface AddURLRequest extends BaseUpsertRequest {
	url: string
}

// Document management response types
export interface AddDocumentResponse {
	message: string
	collection_id: string
	doc_id: string
}

export interface AddFileResponse extends AddDocumentResponse {
	file_id: string
}

export interface AddURLResponse extends AddDocumentResponse {
	url: string
}

// Async operation response
export interface AsyncOperationResponse {
	job_id: string
	doc_id: string
}

// ===== Document List Types =====

// Document status enum
export type DocumentStatus =
	| 'pending'
	| 'converting'
	| 'chunking'
	| 'extracting'
	| 'embedding'
	| 'storing'
	| 'completed'
	| 'maintenance'
	| 'restoring'
	| 'error'

// Document type enum
export type DocumentType = 'file' | 'text' | 'url'

// Document data structure
export interface Document {
	id: number
	document_id: string
	collection_id: string
	name: string
	description?: string
	cover?: string
	tags?: any
	type: DocumentType
	size: number
	segment_count: number
	status: DocumentStatus
	locale?: string
	job_id?: string
	uploader_id?: string
	system?: boolean
	sort?: number

	// File-specific fields
	file_id?: string
	file_name?: string
	file_mime_type?: string

	// URL-specific fields
	url?: string
	url_title?: string

	// Content fields
	text_content?: string

	// Provider configuration fields
	converter_provider_id?: string
	converter_option_id?: string
	converter_properties?: any
	fetcher_provider_id?: string
	fetcher_option_id?: string
	fetcher_properties?: any
	chunking_provider_id?: string
	chunking_option_id?: string
	chunking_properties?: any
	extraction_provider_id?: string
	extraction_option_id?: string
	extraction_properties?: any

	// Timestamps
	processed_at?: string
	error_message?: string
	created_at: string
	updated_at: string
}

// Document list request parameters
export interface ListDocumentsRequest {
	page?: number
	pagesize?: number
	select?: string // comma-separated field names
	keywords?: string
	tag?: string
	collection_id?: string
	status?: string // comma-separated status values
	status_not?: string // comma-separated status values to exclude
	sort?: string // comma-separated sort fields with direction (e.g., "created_at desc,name asc")
}

// Document list response (matches Model.Paginate format)
export interface ListDocumentsResponse {
	data: Document[]
	total: number
	page: number
	pagesize: number
}

// ===== Get Document Types =====

// Get document request parameters
export interface GetDocumentRequest {
	select?: string // comma-separated field names
}

// Get document response (single document)
export type GetDocumentResponse = Document

// ===== Segment Management Types =====

// Segment data structure (matches backend GraphRag Segment type)
export interface Segment {
	id: string
	text: string
	metadata?: Record<string, any>
	score?: number
	weight?: number
	vote?: number
	created_at?: string
	updated_at?: string
	// Graph-related fields
	nodes?: any[]
	relationships?: any[]
}

// List segments request parameters
export interface ListSegmentsRequest {
	limit?: number // Number of segments per page (default: 100)
	offset?: number // Offset for pagination (default: 0)
	order_by?: string // Comma-separated fields to order by
	fields?: string // Comma-separated specific fields to retrieve
	include_nodes?: boolean // Whether to include graph nodes
	include_relationships?: boolean // Whether to include graph relationships
	include_metadata?: boolean // Whether to include segment metadata (default: true)
	// Filter parameters
	score?: number
	weight?: number
	vote?: number
}

// Paginated segments response (matches backend PaginatedSegmentsResult)
export interface ListSegmentsResponse {
	segments: Segment[]
	total: number // Total number of matching segments
	has_more: boolean // Whether there are more pages
	next_offset: number // Offset for next page
}

// Scroll segments request (iterator-style pagination)
export interface ScrollSegmentsRequest {
	limit?: number // Number of segments per batch (default: 100)
	scroll_id?: string // Scroll ID for continuing pagination
	order_by?: string // Comma-separated fields to order by (score, weight, vote, created_at, etc.)
	fields?: string // Comma-separated specific fields to retrieve
	include_nodes?: boolean // Whether to include graph nodes
	include_relationships?: boolean // Whether to include graph relationships
	include_metadata?: boolean // Whether to include segment metadata (default: true)
	// Filter parameters
	score?: number
	weight?: number
	vote?: number
}

// Scroll segments response (matches backend SegmentScrollResult)
export interface ScrollSegmentsResponse {
	segments: Segment[]
	scroll_id?: string // ID for next scroll request
	has_more: boolean // Whether there are more results
}

// ===== Segment Operations Types =====

// Segment text structure for adding/updating segments
export interface SegmentText {
	id?: string
	text: string
}

// Segment vote structure
export interface SegmentVote {
	id: string
	vote?: number
}

// Segment score structure
export interface SegmentScore {
	id: string
	score?: number
}

// Segment weight structure
export interface SegmentWeight {
	id: string
	weight?: number
}

// Update segments request
export interface UpdateSegmentsRequest {
	segment_texts: SegmentText[]
}

// Update segments response
export interface UpdateSegmentsResponse {
	message: string
	updated_count: number
	segments_count: number
}

// Remove segments response
export interface RemoveSegmentsResponse {
	message: string
	segment_ids: string[]
	removed_count: number
}

// Remove segments by document ID response
export interface RemoveSegmentsByDocIDResponse {
	message: string
	doc_id: string
	removed_count: number
}

// Update vote request
export interface UpdateVoteRequest {
	segments: SegmentVote[]
}

// Update vote response
export interface UpdateVoteResponse {
	message: string
	segments: SegmentVote[]
	updated_count: number
}

// Update score request
export interface UpdateScoreRequest {
	segments: SegmentScore[]
}

// Update score response
export interface UpdateScoreResponse {
	message: string
	segments: SegmentScore[]
	updated_count: number
}

// Update weight request
export interface UpdateWeightRequest {
	segments: SegmentWeight[]
}

// Update weight response
export interface UpdateWeightResponse {
	message: string
	segments: SegmentWeight[]
	updated_count: number
}
