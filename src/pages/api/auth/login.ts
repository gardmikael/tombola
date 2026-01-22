import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	success: boolean
	message?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ success: false, message: 'Method not allowed' })
	}

	const { username, password } = req.body

	const adminUsername = process.env.ADMIN_USERNAME || 'admin'
	const adminPassword = process.env.ADMIN_PASSWORD

	if (!adminPassword) {
		return res.status(500).json({ success: false, message: 'Server configuration error' })
	}

	if (username === adminUsername && password === adminPassword) {
		// Sett en httpOnly cookie for session
		const maxAge = 60 * 60 * 24 * 7 // 7 dager
		const cookieOptions = [
			'auth_session=authenticated',
			`Max-Age=${maxAge}`,
			'Path=/',
			'HttpOnly',
			process.env.NODE_ENV === 'production' ? 'Secure' : '',
			'SameSite=Strict',
		].filter(Boolean).join('; ')

		res.setHeader('Set-Cookie', cookieOptions)
		return res.status(200).json({ success: true })
	}

	return res.status(401).json({ success: false, message: 'Invalid credentials' })
}
