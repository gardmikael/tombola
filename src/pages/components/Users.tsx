import {
	Button,
	FormControl,
	List,
	ListItem,
	ListItemText,
	Paper,
	Switch,
	TextField,
} from "@mui/material"
import { useRef } from "react"
import { step, users } from ".."

export const Users = () => {
	const newUserRef = useRef<HTMLInputElement | null>(null)

	const handleNewUser = () => {
		if (newUserRef.current) {
			const newUser = newUserRef.current.value
			users.value = [
				...users.value,
				{ name: newUser, tickets: 1, active: false },
			]
			newUserRef.current.value = ""
		}
	}

	const toggleActive = (index: number) => {
		const newUsers = [...users.value]
		newUsers[index].active = !newUsers[index].active
		users.value = newUsers
	}

	return (
		<>
			<List dense>
				{users.value.map(({ name, active }, index) => (
					<ListItem key={index}>
						<ListItemText sx={{ color: "white" }} primary={name} />
						<Switch
							size='small'
							checked={active}
							onChange={() => toggleActive(index)}
						/>
					</ListItem>
				))}
			</List>
			<FormControl
				fullWidth
				size='small'
				sx={{ display: "flex", my: 2, gap: 2, flexDirection: "row" }}
			>
				<TextField
					label='Navn'
					variant='outlined'
					size='small'
					inputRef={newUserRef}
					sx={{ flex: 1 }}
				/>
				{/* <TextField
									type='number'
									label='Tickets'
									variant='outlined'
									//value={newUserTickets}
									//onChange={(e) => setNewUserTickets(parseInt(e.target.value, 10))}
								/> */}
				<Button
					size='small'
					variant='contained'
					color='primary'
					onClick={handleNewUser}
				>
					Legg til
				</Button>
			</FormControl>
			<Button
				variant='contained'
				color='success'
				onClick={() => {
					step.value = "tombola"
				}}
			>
				Trekk
			</Button>
		</>
	)
}
