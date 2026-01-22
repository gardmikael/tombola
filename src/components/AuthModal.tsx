import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Alert,
} from "@mui/material"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

type AuthModalProps = {
	open: boolean
	onClose: () => void
	onSuccess?: () => void
}

export const AuthModal = ({ open, onClose, onSuccess }: AuthModalProps) => {
	const { login } = useAuth()
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		const success = await login(username, password)
		if (success) {
			setUsername("")
			setPassword("")
			onSuccess?.()
			onClose()
		} else {
			setError("Feil brukernavn eller passord")
		}
		setLoading(false)
	}

	const handleClose = () => {
		setUsername("")
		setPassword("")
		setError("")
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					backdropFilter: "blur(20px)",
					backgroundColor: "#0000004a",
					color: "white",
				},
			}}
		>
			<DialogTitle sx={{ color: "white" }}>Innlogging</DialogTitle>
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
						label="Brukernavn"
						type="text"
						fullWidth
						variant="outlined"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
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
					<TextField
						margin="dense"
						label="Passord"
						type="password"
						fullWidth
						variant="outlined"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						sx={{
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
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={loading}>
						Avbryt
					</Button>
					<Button type="submit" variant="contained" disabled={loading}>
						Logg inn
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
