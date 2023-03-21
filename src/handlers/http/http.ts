import axios from 'axios'
import { URL } from 'url'

export const getPage = async (url: URL): Promise<string> => {
	const res = await axios.get(url.href)

	const d = res.data

	if (typeof d !== 'string') {
		throw new Error(`fetch return was expected to be string, instead got ${typeof d}`)
	}

	return d
}
