import type { NextApiRequest } from 'next'

export function isAuthenticated(req: NextApiRequest): boolean {
	const session = req.cookies.auth_session
	return session === 'authenticated'
}
