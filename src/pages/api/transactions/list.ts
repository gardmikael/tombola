import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isAuthenticated } from '@/utils/auth'

type Transaction = {
	id: string
	amount: number
	receipt_url?: string | null
	created_at: string
	player_count?: number
	amount_per_player?: number
	type: 'expense' | 'income'
}

type Data = {
	success: boolean
	transactions?: Transaction[]
	totalIncome?: number
	totalExpenses?: number
	total?: number
	message?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ success: false, message: 'Method not allowed' })
	}

	if (!isAuthenticated(req)) {
		return res.status(401).json({ success: false, message: 'Unauthorized' })
	}

	try {
		const supabaseAdmin = getSupabaseAdmin()

		// Hent utgifter
		const { data: expenses, error: expensesError } = await supabaseAdmin
			.from('expenses')
			.select('id, amount, receipt_url, created_at')
			.order('created_at', { ascending: false })

		if (expensesError) {
			console.error('Expenses error:', expensesError)
			return res.status(500).json({ success: false, message: 'Failed to fetch expenses' })
		}

		// Hent inntekter
		const { data: income, error: incomeError } = await supabaseAdmin
			.from('income')
			.select('id, amount, player_count, amount_per_player, created_at')
			.order('created_at', { ascending: false })

		if (incomeError) {
			console.error('Income error:', incomeError)
			return res.status(500).json({ success: false, message: 'Failed to fetch income' })
		}

		// Kombiner og formater transaksjoner
		const transactions: Transaction[] = [
			...(expenses || []).map((exp) => ({
				id: exp.id,
				amount: Number(exp.amount),
				receipt_url: exp.receipt_url,
				created_at: exp.created_at,
				type: 'expense' as const,
			})),
			...(income || []).map((inc) => ({
				id: inc.id,
				amount: Number(inc.amount),
				created_at: inc.created_at,
				player_count: inc.player_count,
				amount_per_player: Number(inc.amount_per_player),
				type: 'income' as const,
			})),
		].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

		// Beregn totaler
		const totalIncome = transactions
			.filter((t) => t.type === 'income')
			.reduce((sum, t) => sum + t.amount, 0)

		const totalExpenses = transactions
			.filter((t) => t.type === 'expense')
			.reduce((sum, t) => sum + t.amount, 0)

		const total = totalIncome - totalExpenses

		return res.status(200).json({
			success: true,
			transactions,
			totalIncome,
			totalExpenses,
			total,
		})
	} catch (error) {
		console.error('Error:', error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
}
