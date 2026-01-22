import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	success: boolean
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ success: false })
	}

	// Slett cookie
	const cookieOptions = [
		'auth_session=',
		'Max-Age=0',
		'Path=/',
		'HttpOnly',
		process.env.NODE_ENV === 'production' ? 'Secure' : '',
		'SameSite=Strict',
	].filter(Boolean).join('; ')

	res.setHeader('Set-Cookie', cookieOptions)
	return res.status(200).json({ success: true })
}
