import { useState, useEffect, useCallback } from "react"
import JSConfetti from "js-confetti"
import useSound from "use-sound"

interface User {
	name: string
	active: boolean
}

const RANDOMIZER_TIMEOUT = 13000
const RANDOMIZE_INTERVAL = 500

export const useTombola = (players: User[]) => {
	const [isRunning, setIsRunning] = useState(false)
	const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
	const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
	const jsConfetti = new JSConfetti()

	const [playRandomizer] = useSound("/randomizer.wav", {
		playbackRate: 1,
		volume: 0.5,
	})

	const startTombola = useCallback(() => {
		setIsRunning(true)
		setWinnerIndex(null)
		setSelectedPlayer(null)
		playRandomizer()
	}, [playRandomizer])

	const stopTombola = useCallback(() => {
		setIsRunning(false)
	}, [])

	useEffect(() => {
		if (!isRunning) return

		let timer: NodeJS.Timeout | null = null
		let stopTimeout: NodeJS.Timeout | null = null
		let previousIndex = selectedPlayer

		const updateSelectedPlayer = () => {
			let randomIndex
			do {
				randomIndex = Math.floor(Math.random() * players.length)
			} while (randomIndex === previousIndex)

			setSelectedPlayer(randomIndex)
			previousIndex = randomIndex
		}

		timer = setInterval(updateSelectedPlayer, RANDOMIZE_INTERVAL)

		stopTimeout = setTimeout(() => {
			clearInterval(timer!)
			clearTimeout(stopTimeout!)
			setWinnerIndex(previousIndex)
			jsConfetti.addConfetti()
			stopTombola()
		}, RANDOMIZER_TIMEOUT)

		return () => {
			if (timer) clearInterval(timer)
			if (stopTimeout) clearTimeout(stopTimeout)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRunning])

	return { isRunning, selectedPlayer, winnerIndex, startTombola, stopTombola }
}
