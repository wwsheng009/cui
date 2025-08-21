/**
 * Primitive schema data types supported by provider property definitions.
 * Mirrors common JSON Schema types with an extra 'integer' for numeric integers.
 */
export type PropertyType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array'

/**
 * A single option in an enumerated field.
 */
export interface EnumOption {
	/** Display label shown in UI */
	label: string
	/** Underlying machine value submitted/saved */
	value: string
	/** Optional helper text for this option */
	description?: string
	/** Whether this option is the default selection */
	default?: boolean
}

/**
 * OptionGroup represents a group of related options with a group label.
 */
export interface OptionGroup {
	/** Group label displayed as section header */
	groupLabel: string
	/** Array of options within this group */
	options: EnumOption[]
}

/**
 * Common props interface for all input components
 */
export interface InputComponentProps {
	/** The property schema definition */
	schema: PropertySchema
	/** Current field value */
	value: PropertyValue
	/** Value change handler */
	onChange: (v: PropertyValue) => void
	/** Error message to display (if any) */
	error?: string
	/** Whether the field is in error state */
	hasError?: boolean
}

/**
 * A selectable preset (option) for a provider (e.g., a chunking or embedding preset).
 * The `properties` payload contains the runtime values that map to the provider's schema fields.
 */
export interface ProviderOption {
	/** Human-friendly name of the preset */
	label: string
	/** Unique key for the preset */
	value: string
	/** Brief description shown in UI */
	description: string
	/** Whether this preset is selected by default */
	default?: boolean
	/** Runtime values keyed by property name defined in ProviderSchema */
	properties: Record<string, PropertyValue>
}

/**
 * Provider describes a service (chunking, embedding, converter, etc.) and its selectable presets.
 */
export interface Provider {
	/** Unique provider id (e.g. __yao.structured) */
	id: string
	/** Display label of the provider */
	label: string
	/** Short description of what the provider does */
	description: string
	/** If true, this provider is the default choice */
	default?: boolean
	/** Available selectable presets for this provider */
	options: ProviderOption[]
}

/**
 * PropertySchema describes both the data and UI configuration for a single field in a Provider schema.
 * UI components are strongly typed via `InputComponent` and should correspond to entries under `@inputs/`.
 */
export interface PropertySchema {
	// Data Structure
	/** Data type for this field */
	type: PropertyType
	/** Short label displayed near the field */
	title?: string
	/** Helper text describing the field usage */
	description?: string
	/** Default value applied when undefined */
	default?: unknown
	/** Enumerated options for select-like inputs (can be flat options or grouped options) */
	enum?: (EnumOption | OptionGroup)[]

	// Validation
	/** Whether the field is required */
	required?: boolean
	/** For object types: names of nested properties that are required when the object is provided */
	requiredFields?: string[]
	/** Minimum length for string values */
	minLength?: number
	/** Maximum length for string values */
	maxLength?: number
	/** Regex pattern a string must satisfy */
	pattern?: string
	/** Minimum numeric value (inclusive) */
	minimum?: number
	/** Maximum numeric value (inclusive) */
	maximum?: number
	/** Error message templates with variable interpolation support */
	errorMessages?: {
		required?: string
		minLength?: string
		maxLength?: string
		pattern?: string
		minimum?: string
		maximum?: string
		custom?: string
	}

	// UI Configuration
	/** Input component to render from `@inputs/` */
	component?: InputComponent // enumerated input component
	/** Placeholder text for inputs */
	placeholder?: string
	/** Additional help text below the field */
	help?: string
	/** Field ordering index within a group/form */
	order?: number
	/** If true, the field is not displayed */
	hidden?: boolean
	/** If true, the field is disabled (non-interactive) */
	disabled?: boolean
	/** If true, the field is read-only */
	readOnly?: boolean
	/** Visual width hint (e.g. full, half, third, quarter) */
	width?: string
	/** Grouping name for organizing fields in UI */
	group?: string

	// Object / Array
	/** Nested properties when type === 'object' (use with component: 'Nested') */
	properties?: Record<string, PropertySchema>
	/** Array item schema when type === 'array' (use with component: 'Items') */
	items?: PropertySchema
}

/**
 * ProviderSchema is a typed contract that defines how to render and validate a provider's properties.
 * `id` should match the Provider id it applies to, `properties` holds field schemas keyed by field name.
 */
export interface ProviderSchema {
	/** Provider id this schema applies to */
	id: string // provider id this schema applies to
	/** Optional form title */
	title?: string
	/** Optional form description */
	description?: string
	/** Field schemas keyed by property name */
	properties: Record<string, PropertySchema>
	/** Names of properties that are required */
	required?: string[]
}

/**
 * Response for fetching a provider definition together with its UI+validation schema.
 */
export interface ProviderAndSchemaResponse {
	/** Provider definition (id, label, presets, etc.) */
	provider: Provider
	/** UI + validation schema for the provider */
	schema: ProviderSchema
}

/**
 * Available UI input components under `@inputs/`.
 * Keep in sync with the folders in `cui/pages/knowledge/components/Provider/inputs`.
 */
export type InputComponent =
	| 'Input'
	| 'InputNumber'
	| 'InputPassword'
	| 'Switch'
	| 'CheckboxGroup'
	| 'RadioGroup'
	| 'Slider'
	| 'Group'
	| 'Select'
	| 'Nested'
	| 'Items'
	| 'TextArea'
	| 'CodeEditor'

/**
 * Runtime value type for `ProviderOption.properties` entries.
 * Matches the possible values permitted by the corresponding `PropertySchema`.
 */
export type PropertyValue = string | number | boolean | PropertyValue[] | { [key: string]: PropertyValue }

/**
 * Lightweight schema summary for list views or lookups.
 */
export interface ProviderSchemaSummary {
	id: string
	title?: string
	description?: string
}
