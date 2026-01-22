import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Alert,
	Box,
	Typography,
} from "@mui/material"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthModal } from "./AuthModal"

type ExpenseModalProps = {
	open: boolean
	onClose: () => void
	onSuccess?: () => void
}

export const ExpenseModal = ({ open, onClose, onSuccess }: ExpenseModalProps) => {
	const { isAuthenticated, checkAuth } = useAuth()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [amount, setAmount] = useState("")
	const [receiptFile, setReceiptFile] = useState<File | null>(null)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	// Sjekk autentisering når modalen åpnes
	useEffect(() => {
		if (open) {
			// Sjekk autentisering direkte
			fetch("/api/auth/verify")
				.then((res) => res.json())
				.then((data) => {
					if (!data.authenticated) {
						setShowAuthModal(true)
					}
					// Oppdater auth state
					checkAuth()
				})
				.catch(() => {
					setShowAuthModal(true)
				})
		}
	}, [open, checkAuth])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		// Sjekk autentisering først
		const authCheck = await fetch("/api/auth/verify")
		const authData = await authCheck.json()

		if (!authData.authenticated) {
			setShowAuthModal(true)
			return
		}

		if (!amount || Number.parseFloat(amount) <= 0) {
			setError("Beløpet må være større enn 0")
			return
		}

		setLoading(true)

		try {
			const formData = new FormData()
			formData.append("amount", amount)
			if (receiptFile) {
				formData.append("receipt", receiptFile)
			}

			const response = await fetch("/api/expenses/create", {
				method: "POST",
				body: formData,
			})

			if (response.ok) {
				setAmount("")
				setReceiptFile(null)
				onSuccess?.()
				onClose()
			} else if (response.status === 401) {
				// Hvis ikke autentisert, vis auth modal
				setShowAuthModal(true)
				setError("")
			} else {
				const data = await response.json().catch(() => ({ message: "Ukjent feil" }))
				setError(data.message || "Kunne ikke lagre utgift")
			}
		} catch (err: any) {
			console.error("Error submitting expense:", err)
			setError(err.message || "En feil oppstod. Prøv igjen.")
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		setAmount("")
		setReceiptFile(null)
		setError("")
		onClose()
	}

	const handleAuthSuccess = async () => {
		setShowAuthModal(false)
		await checkAuth()
		// Prøv å lagre igjen hvis brukeren har fylt ut skjemaet
		if (amount && Number.parseFloat(amount) > 0) {
			// Trigger submit igjen
			const form = document.querySelector('form') as HTMLFormElement
			if (form) {
				form.requestSubmit()
			}
		}
	}

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						backdropFilter: "blur(20px)",
						backgroundColor: "#0000004a",
						color: "white",
					},
				}}
			>
				<DialogTitle sx={{ color: "white" }}>Legg inn utgift</DialogTitle>
				<form onSubmit={handleSubmit}>
					<DialogContent>
						{error && (
							<Alert
								severity="error"
								sx={{
									mb: 2,
									backgroundColor: "rgba(211, 47, 47, 0.2)",
									color: "white",
									"& .MuiAlert-icon": {
										color: "#ff6b6b",
									},
								}}
							>
								{error}
							</Alert>
						)}
						<TextField
							autoFocus
							margin="dense"
							label="Beløp (kr)"
							type="number"
							fullWidth
							variant="outlined"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
							inputProps={{ step: "0.01", min: "0.01" }}
							sx={{
								mb: 2,
								"& .MuiOutlinedInput-root": {
									color: "white",
									"& fieldset": {
										borderColor: "rgba(255, 255, 255, 0.3)",
									},
									"&:hover fieldset": {
										borderColor: "rgba(255, 255, 255, 0.5)",
									},
									"&.Mui-focused fieldset": {
										borderColor: "rgba(255, 255, 255, 0.7)",
									},
								},
								"& .MuiInputLabel-root": {
									color: "rgba(255, 255, 255, 0.7)",
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "rgba(255, 255, 255, 0.9)",
								},
							}}
						/>
						<Box>
							<Typography variant="body2" sx={{ mb: 1, color: "white" }}>
								Kvittering (valgfritt)
							</Typography>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files?.[0]
									if (file) {
										// Valider filstørrelse (max 10MB)
										if (file.size > 10 * 1024 * 1024) {
											setError("Bildet er for stort. Maks størrelse er 10MB")
											return
										}
										setReceiptFile(file)
									}
								}}
								style={{
									width: "100%",
									padding: "8px",
									border: "1px solid rgba(255, 255, 255, 0.3)",
									borderRadius: "4px",
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									color: "white",
									cursor: "pointer",
								}}
							/>
							{receiptFile && (
								<Typography
									variant="caption"
									sx={{ mt: 1, display: "block", color: "white" }}
								>
									Valgt: {receiptFile.name}
								</Typography>
							)}
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} disabled={loading}>
							Avbryt
						</Button>
						<Button type="submit" variant="contained" disabled={loading}>
							{loading ? "Lagrer..." : "Lagre"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<AuthModal
				open={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onSuccess={handleAuthSuccess}
			/>
		</>
	)
}
