import { getAvatar } from "@/data/avatars"
import { Box, Grid2 as Grid, Typography } from "@mui/material"
import Image from "next/image"

type PlayerListProps = {
	isRunning: boolean
	winnerIndex: number | null
	selectedPlayer: number | null
	players: { name: string }[]
}
export function PlayerList({
	isRunning,
	winnerIndex,
	selectedPlayer,
	players,
}: PlayerListProps) {
	return (
		<Grid
			container
			spacing={2}
			className={!isRunning && winnerIndex !== null ? "we-have-a-winner" : ""}
		>
			{players.map(({ name }, index) => (
				<Grid
					key={`user-${index}`}
					size={{ xs: 3 }}
					className={
						index === winnerIndex
							? "winner"
							: index === selectedPlayer
							? "active"
							: ""
					}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							src={getAvatar(name)}
							width={80}
							height={80}
							alt={`Bilde ta ${name}`}
						/>
						<Typography sx={{ textAlign: "center" }}>{name}</Typography>
					</Box>
				</Grid>
			))}
		</Grid>
	)
}
