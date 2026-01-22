import { IconButton, Tooltip, Box } from "@mui/material"
import { useState } from "react"
import { ExpenseModal } from "./ExpenseModal"
import { useApp } from "@/context/AppContext"

export const ExpenseButton = () => {
	const [expenseModalOpen, setExpenseModalOpen] = useState(false)
	const { setStep } = useApp()

	return (
		<>
			<Box
				sx={{
					position: "fixed",
					bottom: 20,
					right: 20,
					display: "flex",
					flexDirection: "column",
					gap: 1,
				}}
			>
				<Tooltip title="Legg inn utgift" arrow>
					<IconButton
						onClick={() => setExpenseModalOpen(true)}
						sx={{
							backgroundColor: "rgba(0, 0, 0, 0.4)",
							backdropFilter: "blur(10px)",
							color: "white",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.6)",
							},
						}}
					>
						<span style={{ fontSize: "1.2rem" }}>💰</span>
					</IconButton>
				</Tooltip>
				<Tooltip title="Se transaksjoner" arrow>
					<IconButton
						onClick={() => setStep("transactions")}
						sx={{
							backgroundColor: "rgba(0, 0, 0, 0.4)",
							backdropFilter: "blur(10px)",
							color: "white",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.6)",
							},
						}}
					>
						<span style={{ fontSize: "1.2rem" }}>📊</span>
					</IconButton>
				</Tooltip>
			</Box>
			<ExpenseModal
				open={expenseModalOpen}
				onClose={() => setExpenseModalOpen(false)}
			/>
		</>
	)
}
