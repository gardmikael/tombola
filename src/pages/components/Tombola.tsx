import { Box, Button, Grid, Typography } from "@mui/material"
import { users } from ".."
import { computed, signal } from "@preact/signals-react"
import { createAvatar } from "@dicebear/core"
import { avataaars } from "@dicebear/collection"
import Image from "next/image"
import { useEffect, useState } from "react"

export const Tombola = () => {
	const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(
		null
	)
	const [isRunning, setIsRunning] = useState(false)
	const [winnerIndex, setWinnerIndex] = useState<number | null>(null)

	const players = computed(() => {
		return users.value.filter((user) => user.active)
	})

	const avatars = players.value.map(({ name }, index) => ({
		name: name,
		avatar: createAvatar(avataaars, {
			seed: name,
			accessoriesProbability: 50,
		}),
		index: index,
	}))

	useEffect(() => {
		if (isRunning) {
			let previousIndex = activePlayerIndex // Store the previous index
			const timer = setInterval(() => {
				let randomIndex
				do {
					randomIndex = Math.floor(Math.random() * avatars.length)
				} while (randomIndex === previousIndex) // Keep looping until a different player is selected

				setActivePlayerIndex(randomIndex)
				previousIndex = randomIndex // Update the previous index
			}, 600)

			// Stop the timer after 15 seconds
			setTimeout(() => {
				clearInterval(timer)
				setIsRunning(false)
				setWinnerIndex(activePlayerIndex) // Set the winner
			}, 15000)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRunning])

	const startTombola = () => {
		setIsRunning(true)
		setWinnerIndex(null) // Reset the winner
	}

	return (
		<div>
			<Grid container spacing={2}>
				{avatars.map(({ name, avatar, index }, currentIndex) => (
					<Grid
						key={`user-${index}`}
						item
						xs={3}
						className={
							currentIndex === activePlayerIndex && isRunning
								? "active"
								: currentIndex === winnerIndex
								? "winner"
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
								src={avatar.toDataUriSync()}
								width={80}
								height={80}
								alt={`Bilte ta ${name}`}
							/>
							<Typography>{name}</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
			<Button
				variant='contained'
				color='info'
				onClick={startTombola}
				disabled={isRunning}
				sx={{ display: "flex", margin: "auto", my: 3 }}
			>
				Start
			</Button>
		</div>
	)
}
