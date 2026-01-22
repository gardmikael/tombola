import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Alert,
	CircularProgress,
	Button,
	Link,
} from "@mui/material"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthModal } from "./AuthModal"

type Transaction = {
	id: string
	amount: number
	receipt_url?: string | null
	created_at: string
	player_count?: number
	amount_per_player?: number
	type: "expense" | "income"
}

type TransactionsData = {
	transactions: Transaction[]
	totalIncome: number
	totalExpenses: number
	total: number
}

export const Transactions = ({ onClose }: { onClose: () => void }) => {
	const { isAuthenticated, checkAuth } = useAuth()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [data, setData] = useState<TransactionsData | null>(null)

	const fetchTransactions = async () => {
		setLoading(true)
		setError("")

		try {
			const response = await fetch("/api/transactions/list")
			if (response.status === 401) {
				setShowAuthModal(true)
				setLoading(false) // Stopp spinner når vi viser auth modal
				return
			}

			if (!response.ok) {
				throw new Error("Kunne ikke hente transaksjoner")
			}

			const result = await response.json()
			if (result.success) {
				setData({
					transactions: result.transactions || [],
					totalIncome: result.totalIncome || 0,
					totalExpenses: result.totalExpenses || 0,
					total: result.total || 0,
				})
			} else {
				setError(result.message || "Kunne ikke hente transaksjoner")
			}
		} catch (err) {
			setError("En feil oppstod")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		// Sjekk autentisering når komponenten lastes
		fetch("/api/auth/verify")
			.then((res) => res.json())
			.then((authData) => {
				if (!authData.authenticated) {
					setShowAuthModal(true)
					setLoading(false) // Stopp spinner når vi viser auth modal
				} else {
					fetchTransactions()
				}
				checkAuth()
			})
			.catch(() => {
				setShowAuthModal(true)
				setLoading(false) // Stopp spinner ved feil
			})
	}, [checkAuth])

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("no-NO", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const handleAuthSuccess = async () => {
		setShowAuthModal(false)
		await checkAuth()
		fetchTransactions()
	}

	if (loading) {
		return (
			<>
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
					<CircularProgress sx={{ color: "white" }} />
				</Box>
				<AuthModal
					open={showAuthModal}
					onClose={() => {
						setShowAuthModal(false)
						onClose()
					}}
					onSuccess={handleAuthSuccess}
				/>
			</>
		)
	}

	if (error && !data) {
		return (
			<>
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
				<Button onClick={onClose} variant="outlined" sx={{ color: "white" }}>
					Tilbake
				</Button>
			</>
		)
	}

	return (
		<>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h5" sx={{ color: "white", mb: 2 }}>
					Transaksjoner
				</Typography>
				{data && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="body1" sx={{ color: "white" }}>
							Total inntekt: <strong>{data.totalIncome.toFixed(2)} kr</strong>
						</Typography>
						<Typography variant="body1" sx={{ color: "white" }}>
							Total utgift: <strong>{data.totalExpenses.toFixed(2)} kr</strong>
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: data.total >= 0 ? "#4caf50" : "#f44336",
								mt: 1,
							}}
						>
							Resultat: <strong>{data.total.toFixed(2)} kr</strong>
						</Typography>
					</Box>
				)}
			</Box>

			{data && data.transactions.length > 0 ? (
				<TableContainer
					component={Paper}
					sx={{
						backgroundColor: "rgba(0, 0, 0, 0.3)",
						backdropFilter: "blur(10px)",
						maxHeight: 400,
						overflow: "auto",
					}}
				>
					<Table size="small" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ color: "white", fontWeight: "bold" }}>
									Dato
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: "bold" }}>
									Type
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: "bold" }}>
									Beløp
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: "bold" }}>
									Detaljer
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: "bold" }}>
									Kvittering
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell sx={{ color: "white" }}>
										{formatDate(transaction.created_at)}
									</TableCell>
									<TableCell sx={{ color: "white" }}>
										{transaction.type === "income" ? "Inntekt" : "Utgift"}
									</TableCell>
									<TableCell
										sx={{
											color:
												transaction.type === "income" ? "#4caf50" : "#f44336",
											fontWeight: "bold",
										}}
									>
										{transaction.type === "income" ? "+" : "-"}
										{transaction.amount.toFixed(2)} kr
									</TableCell>
									<TableCell sx={{ color: "white" }}>
										{transaction.type === "income" && transaction.player_count
											? `${transaction.player_count} spillere × ${transaction.amount_per_player?.toFixed(2)} kr`
											: "-"}
									</TableCell>
									<TableCell sx={{ color: "white" }}>
										{transaction.receipt_url ? (
											<Link
												href={transaction.receipt_url}
												target="_blank"
												rel="noopener noreferrer"
												sx={{ color: "#90caf9" }}
											>
												Vis
											</Link>
										) : (
											"-"
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Typography variant="body1" sx={{ color: "white", mb: 2 }}>
					Ingen transaksjoner funnet
				</Typography>
			)}

			<Box sx={{ mt: 3 }}>
				<Button onClick={onClose} variant="outlined" sx={{ color: "white" }}>
					Tilbake
				</Button>
			</Box>

			<AuthModal
				open={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onSuccess={handleAuthSuccess}
			/>
		</>
	)
}
