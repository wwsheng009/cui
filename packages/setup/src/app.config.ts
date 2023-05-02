export const api = {
	check: '/api/__yao/app/check',
	setup: '/api/__yao/app/setup'
}

export const metadata_env = {
	YAO_LANG: {
		name: '语言',
		value: ['中文', 'English']
	},
	YAO_ENV: {
		name: '启动模式',
		value: ['开发模式(推荐)', '生产模式']
	},
	YAO_PORT: {
		name: '监听端口',
		value: 'number',
		default: 5099
	},
	YAO_STUDIO_PORT: {
		name: 'Studio 端口',
		value: 'number',
		default: 5077
	}
}

export const metadata_connector = {
	type: {
		name: '数据库类型',
		value: ['sqlite', 'mysql', 'postgres', 'hdb']
		// value: ['mysql', 'sqlite3', 'mongo', 'redis']
	}
}

export const metadata_connector_options = {
	sqlite: {
		file: {
			name: '数据库文件地址',
			value: 'string',
			default: 'db/yao.db'
		}
	},
	mysql: {
		db: {
			name: '数据库名称',
			value: 'string',
			default: 'yao'
		},
		hosts: {
			name: 'Mysql服务设置',
			value: {
				host: {
					name: '服务地址',
					value: 'string',
					default: '127.0.0.1'
				},
				port: {
					name: '服务端口',
					value: 'number',
					default: 3306
				},
				user: {
					name: '用户名',
					value: 'string',
					default: 'root'
				},
				pass: {
					name: '密码',
					value: 'password'
				}
			}
		}
	},
	postgres: {
		db: {
			name: '数据库名称',
			value: 'string',
			default: 'yao'
		},
		hosts: {
			name: 'PG服务设置',
			value: {
				host: {
					name: '服务地址',
					value: 'string',
					default: '127.0.0.1'
				},
				port: {
					name: '服务端口',
					value: 'number',
					default: 5432
				},
				schema: {
					name: '默认Schema',
					value: 'string',
					default: 'public'
				},
				user: {
					name: '用户名',
					value: 'string',
					default: 'root'
				},
				pass: {
					name: '密码',
					value: 'password'
				},
				sslmode: {
					name: 'SSL模式',
					value: 'string',
					default: 'disable'
				}
			}
		}
	},
	hdb: {
		db: {
			name: '数据库名称',
			value: 'string',
			default: 'yao'
		},
		hosts: {
			name: 'HDB服务设置',
			value: {
				host: {
					name: '服务地址',
					value: 'string',
					default: '127.0.0.1'
				},
				port: {
					name: '服务端口',
					value: 'number',
					default: 30015
				},
				user: {
					name: '用户名',
					value: 'string',
					default: 'root'
				},
				pass: {
					name: '密码',
					value: 'password'
				},
				schema: {
					name: '默认Schema',
					value: 'string'
				}
			}
		}
	}

	// mongo: {
	// 	db: {
	// 		name: '数据库名称',
	// 		value: 'string'
	// 	},
	// 	hosts: {
	// 		name: 'Mongo服务设置',
	// 		value: {
	// 			host: {
	// 				name: '服务域名',
	// 				value: 'string'
	// 			},
	// 			port: {
	// 				name: '服务端口',
	// 				value: 'number'
	// 			},
	// 			user: {
	// 				name: '用户名',
	// 				value: 'string'
	// 			},
	// 			pass: {
	// 				name: '密码',
	// 				value: 'string'
	// 			}
	// 		}
	// 	}
	// },

	// redis: {
	// 	db: {
	// 		name: '数据库名称',
	// 		value: 'string'
	// 	},
	// 	host: {
	// 		name: '服务域名',
	// 		value: 'string'
	// 	},
	// 	port: {
	// 		name: '服务端口',
	// 		value: 'number'
	// 	},
	// 	user: {
	// 		name: '用户名',
	// 		value: 'string'
	// 	},
	// 	pass: {
	// 		name: '密码',
	// 		value: 'string'
	// 	}
	// }
}
