import { Button } from "@mui/material"
import { useApp } from "@/context/AppContext"
import { useTombola } from "@/hooks/useTombola"
import { PlayerList } from "./PlayerList"

export const Tombola = () => {
	const { users } = useApp()
	const players = users.filter((user) => user.active)
	const { isRunning, selectedPlayer, winnerIndex, startTombola } =
		useTombola(players)

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
		</>
	)
}
