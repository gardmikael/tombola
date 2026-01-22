import { Button } from "@mui/material"
import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { useTombola } from "@/hooks/useTombola"
import { PlayerList } from "./PlayerList"
import { IncomeModal } from "./IncomeModal"

export const Tombola = () => {
	const { users } = useApp()
	const players = users.filter((user) => user.active)
	const { isRunning, selectedPlayer, winnerIndex, startTombola } =
		useTombola(players)
	const [incomeModalOpen, setIncomeModalOpen] = useState(false)

	return (
		<>
			<PlayerList {...{ isRunning, winnerIndex, selectedPlayer, players }} />
			{!winnerIndex && (
				<Button
					variant='contained'
					color='info'
					onClick={startTombola}
					disabled={isRunning}
					sx={{ display: "flex", margin: "auto", my: 3 }}
				>
					Start
				</Button>
			)}
			{winnerIndex !== null && (
				<Button
					variant='contained'
					color='success'
					onClick={() => setIncomeModalOpen(true)}
					sx={{ display: "flex", margin: "auto", my: 3 }}
				>
					Lagre inntekt
				</Button>
			)}
			<IncomeModal
				open={incomeModalOpen}
				onClose={() => setIncomeModalOpen(false)}
				playerCount={players.length}
				defaultAmountPerPlayer={25}
			/>
		</>
	)
}
