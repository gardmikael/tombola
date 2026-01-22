import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isAuthenticated } from '@/utils/auth'

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

	if (!isAuthenticated(req)) {
		return res.status(401).json({ success: false, message: 'Unauthorized' })
	}

	const { amount, playerCount, amountPerPlayer } = req.body

	if (!amount || amount <= 0) {
		return res.status(400).json({ success: false, message: 'Invalid amount' })
	}

	if (!playerCount || playerCount <= 0) {
		return res.status(400).json({ success: false, message: 'Invalid player count' })
	}

	if (!amountPerPlayer || amountPerPlayer <= 0) {
		return res.status(400).json({ success: false, message: 'Invalid amount per player' })
	}

	try {
		const supabaseAdmin = getSupabaseAdmin()
		const { error } = await supabaseAdmin
			.from('income')
			.insert({
				amount: parseFloat(amount),
				player_count: parseInt(playerCount),
				amount_per_player: parseFloat(amountPerPlayer),
				user_id: 'admin', // Statisk siden vi kun har én admin
			})

		if (error) {
			console.error('Database error:', error)
			return res.status(500).json({ success: false, message: 'Failed to save income' })
		}

		return res.status(200).json({ success: true })
	} catch (error) {
		console.error('Error:', error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
}
