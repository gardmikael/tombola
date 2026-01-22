import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isAuthenticated } from '@/utils/auth'
import { IncomingForm } from 'formidable'
import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'node:path'
import os from 'node:os'

export const config = {
	api: {
		bodyParser: false,
	},
}

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

	try {
		// Opprett en sikker midlertidig mappe
		const uploadDir = path.join(os.tmpdir(), 'tombola-uploads')
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true })
		}

		// Begrens filtyper til bilder
		const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])
		const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
		
		const form = new IncomingForm({
			uploadDir,
			keepExtensions: true,
			maxFileSize: 10 * 1024 * 1024, // 10MB
			allowEmptyFiles: false,
			filter: (part) => {
				// Kun tillat bilder - sjekk både MIME-type og filnavn
				if (!part.mimetype || !part.originalFilename) {
					return false
				}
				const ext = path.extname(part.originalFilename).toLowerCase()
				const isValidExt = allowedExtensions.has(ext)
				const isValidMime = allowedMimeTypes.has(part.mimetype)
				// Begge må være gyldige
				return isValidExt && isValidMime
			},
		})
		
		const [fields, files] = await form.parse(req)

		const amount = Array.isArray(fields.amount) ? fields.amount[0] : fields.amount
		const receipt = Array.isArray(files.receipt) ? files.receipt[0] : files.receipt

		if (!amount || Number.parseFloat(amount) <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid amount' })
		}

		let receiptUrl: string | null = null

		// Håndter bildeopplasting hvis det finnes
		if (receipt) {
			// Valider filtype
			const fileExtension = path.extname(receipt.originalFilename || '').toLowerCase()
			if (!allowedExtensions.has(fileExtension)) {
				// Slett filen hvis den ikke er tillatt
				if (fs.existsSync(receipt.filepath)) {
					fs.unlinkSync(receipt.filepath)
				}
				return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' })
			}

			const supabaseAdmin = getSupabaseAdmin()
			const fileName = `${uuidv4()}${fileExtension}`
			const filePath = receipt.filepath

			// Les filen
			const fileBuffer = fs.readFileSync(filePath)

			// Last opp til Supabase Storage
			const { error: uploadError } = await supabaseAdmin.storage
				.from('receipts')
				.upload(fileName, fileBuffer, {
					contentType: receipt.mimetype || 'image/jpeg',
					upsert: false,
				})

			if (uploadError) {
				console.error('Upload error:', uploadError)
				return res.status(500).json({ success: false, message: 'Failed to upload receipt' })
			}

			// Hent public URL
			const { data: urlData } = supabaseAdmin.storage
				.from('receipts')
				.getPublicUrl(fileName)

			receiptUrl = urlData.publicUrl

			// Slett midlertidig fil
			fs.unlinkSync(filePath)
		}

		// Lagre utgift i database
		const supabaseAdmin = getSupabaseAdmin()
		const { error: dbError } = await supabaseAdmin
			.from('expenses')
			.insert({
				amount: Number.parseFloat(amount),
				receipt_url: receiptUrl,
				user_id: 'admin', // Statisk siden vi kun har én admin
			})

		if (dbError) {
			console.error('Database error:', dbError)
			return res.status(500).json({ success: false, message: 'Failed to save expense' })
		}

		return res.status(200).json({ success: true })
	} catch (error) {
		console.error('Error:', error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
}
