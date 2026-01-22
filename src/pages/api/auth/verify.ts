import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	authenticated: boolean
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ authenticated: false })
	}

	const session = req.cookies.auth_session
	const authenticated = session === 'authenticated'

	return res.status(200).json({ authenticated })
}
