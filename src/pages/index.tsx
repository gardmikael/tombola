import { Container, Paper } from "@mui/material"
import Head from "next/head"
import YouTube from "react-youtube"
import { Users } from "../components/Users"
import { Tombola } from "../components/Tombola"
import { signal } from "@preact/signals-react"

export const users = signal([
	{ name: "Gard", tickets: 1, active: false },
	{ name: "Hans", tickets: 1, active: false },
	{ name: "Henning", tickets: 1, active: false },
	{ name: "Jarle", tickets: 1, active: false },
	{ name: "Tone", tickets: 1, active: false },
	{ name: "Trude", tickets: 1, active: false },
	{ name: "Thor-Eirik", tickets: 1, active: false },
	{ name: "Bennny", tickets: 1, active: false },
	{ name: "Katja", tickets: 1, active: false },
	{ name: "Kristin V", tickets: 1, active: false },
	{ name: "Kristin S", tickets: 1, active: false },
	{ name: "Kine", tickets: 1, active: false },
	{ name: "Maria", tickets: 1, active: false },
	{ name: "Ines", tickets: 1, active: false },
	{ name: "Ole-Aleksander", tickets: 1, active: false },
])

export const step = signal("users")

export default function Home() {
	const VIDEO_ID = "yYQOjWlQkxg" //"Uiswg6S-vXQ"
	const opts = {
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
			controls: 0,
			disablekb: 1,
			loop: 1,
			fs: 0,
			iv_load_policy: 3,
			showInfo: 0,
			mute: 1,
			modestbranding: 1,
			playlist: VIDEO_ID,
		},
	}

	const Stepper: Record<string, JSX.Element> = {
		users: <Users />,
		tombola: <Tombola />,
	}

	return (
		<>
			<Head>
				<title>Tombola</title>
				<meta name='description' content='Vinlotteri' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main style={{ height: "100vh", display: "flex", alignItems: "center" }}>
				<YouTube
					videoId={VIDEO_ID}
					opts={opts}
					className='video foo'
					iframeClassName='video'
				/>

				<Container>
					<Paper
						className='paper'
						elevation={5}
						sx={{ p: 5, maxWidth: 500, margin: "auto" }}
					>
						{Stepper[step.value]}
					</Paper>
				</Container>
			</main>
		</>
	)
}
