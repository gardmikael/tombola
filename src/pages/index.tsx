import { Box, Container, Paper } from "@mui/material"
import Head from "next/head"
import { AppProvider } from "@/context/AppContext"
import { Stepper } from "@/components/Stepper"
import { ExpenseButton } from "@/components/ExpenseButton"

export default function Home() {
	return (
		<>
			<Head>
				<title>Tombola</title>
				<meta name='description' content='Vinlotteri' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Box
				component='main'
				style={{ height: "100vh", display: "flex", alignItems: "center", position: "relative" }}
			>
				<AppProvider>
					<Container>
						<Paper
							className='paper'
							elevation={5}
							sx={{ p: 5, maxWidth: 500, margin: "auto" }}
						>
							<Stepper />
						</Paper>
					</Container>
					<ExpenseButton />
				</AppProvider>
			</Box>
		</>
	)
}
