import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Alert,
	Typography,
	Box,
} from "@mui/material"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthModal } from "./AuthModal"

type IncomeModalProps = {
	open: boolean
	onClose: () => void
	playerCount: number
	defaultAmountPerPlayer?: number
	onSuccess?: () => void
}

export const IncomeModal = ({
	open,
	onClose,
	playerCount,
	defaultAmountPerPlayer = 25,
	onSuccess,
}: IncomeModalProps) => {
	const { isAuthenticated, checkAuth } = useAuth()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [amountPerPlayer, setAmountPerPlayer] = useState(
		defaultAmountPerPlayer.toString()
	)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const totalAmount = parseFloat(amountPerPlayer) * playerCount || 0

	useEffect(() => {
		if (open) {
			setAmountPerPlayer(defaultAmountPerPlayer.toString())
			setError("")
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
	}, [open, defaultAmountPerPlayer, checkAuth])

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

		const amount = parseFloat(amountPerPlayer)
		if (!amount || amount <= 0) {
			setError("Beløpet per spiller må være større enn 0")
			return
		}

		setLoading(true)

		try {
			const response = await fetch("/api/income/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: totalAmount,
					playerCount,
					amountPerPlayer: amount,
				}),
			})

			if (response.ok) {
				onSuccess?.()
				onClose()
			} else if (response.status === 401) {
				// Hvis ikke autentisert, vis auth modal
				setShowAuthModal(true)
				setError("")
			} else {
				const data = await response.json()
				setError(data.message || "Kunne ikke lagre inntekt")
			}
		} catch (err) {
			setError("En feil oppstod")
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		setAmountPerPlayer(defaultAmountPerPlayer.toString())
		setError("")
		onClose()
	}

	const handleAuthSuccess = async () => {
		setShowAuthModal(false)
		await checkAuth()
		// Prøv å lagre igjen hvis beløpet er satt
		const amount = parseFloat(amountPerPlayer)
		if (amount && amount > 0) {
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
				<DialogTitle sx={{ color: "white" }}>Lagre inntekt fra tombola</DialogTitle>
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
						<Box sx={{ mb: 2 }}>
							<Typography variant="body1" sx={{ mb: 1, color: "white" }}>
								Antall spillere: <strong>{playerCount}</strong>
							</Typography>
						</Box>
						<TextField
							autoFocus
							margin="dense"
							label="Beløp per spiller (kr)"
							type="number"
							fullWidth
							variant="outlined"
							value={amountPerPlayer}
							onChange={(e) => setAmountPerPlayer(e.target.value)}
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
							<Typography variant="h6" sx={{ color: "white" }}>
								Totalt: <strong>{totalAmount.toFixed(2)} kr</strong>
							</Typography>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} disabled={loading}>
							Hopp over
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
