import axios, { AxiosError } from 'axios'
import { URL } from 'url'

export const getPage = async (url: URL): Promise<string> => {
	try {
		const res = await axios.get(url.href)

		const d = res.data

		if (typeof d !== 'string') {
			throw new Error(`fetch return was expected to be string, instead got ${typeof d}`)
		}

		return d
	} catch (e) {
		if (e instanceof AxiosError) {
			throw new Error(`failed axios request for page from afl tables, error: ${e.code} - ${e.message}`)
		} else {
			throw new Error('failed axios request for page from afl tables, error unknown:' + e)
		}
	}
}
