import { Box, Button, Grid, Typography } from "@mui/material"
import { users } from "../pages"
import { computed, signal } from "@preact/signals-react"
import Image from "next/image"
import { useEffect } from "react"
import JSConfetti from "js-confetti"
import { getAvatar } from "@/data/avatars"
import useSound from "use-sound"

const isRunning = signal(false)
const selectedPlayer = signal<number | null>(null)
const winnerIndex = signal<number | null>(null)

export const Tombola = () => {
	const players = computed(() => {
		return users.value.filter((user) => user.active)
	})
	const jsConfetti = new JSConfetti()
	const [playRandomizer] = useSound("/randomizer.wav")

	useEffect(() => {
		if (isRunning.value) {
			playRandomizer()
			let previousIndex = selectedPlayer.value // Store the previous index
			const timer = setInterval(() => {
				let randomIndex
				do {
					randomIndex = Math.floor(Math.random() * players.value.length)
				} while (randomIndex === previousIndex) // Keep looping until a different player is selected

				selectedPlayer.value = randomIndex

				previousIndex = randomIndex // Update the previous index
			}, 500)

			// Stop the timer after 13 seconds
			setTimeout(() => {
				winnerIndex.value = selectedPlayer.value
				jsConfetti.addConfetti()
				setTimeout(() => {
					clearInterval(timer)
					isRunning.value = false
				}, 500)
				clearInterval(timer)
			}, 13000)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRunning.value])

	const startTombola = () => {
		isRunning.value = true
		winnerIndex.value = null
	}

	return (
		<div>
			<Grid
				container
				spacing={2}
				className={
					!isRunning.value && winnerIndex.value ? "we-have-a-winner" : ""
				}
			>
				{players.value.map(({ name }, index) => (
					<Grid
						key={`user-${index}`}
						item
						xs={3}
						className={
							index === winnerIndex.value
								? "winner"
								: index === selectedPlayer.value
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
			<Button
				variant='contained'
				color='info'
				onClick={startTombola}
				disabled={isRunning.value}
				sx={{ display: "flex", margin: "auto", my: 3 }}
			>
				Start
			</Button>
		</div>
	)
}
