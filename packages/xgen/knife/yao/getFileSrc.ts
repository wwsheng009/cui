import getToken from './getToken'

const Index = (name: string) => {
	if (typeof name !== 'string') {
		return
	}
	if (name.startsWith('http')) return name

	return `${name}&token=${getToken()}`
}

export default Index
