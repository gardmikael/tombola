import {
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	Switch,
	TextField,
} from "@mui/material"

import { useApp } from "@/context/AppContext"

export const Users = () => {
	const { setStep, users, toggleActive, addUser } = useApp()

	return (
		<>
			<List dense>
				{users.map(({ name, active }, index) => (
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
			<Box component='form' sx={{ display: "flex", gap: 2 }} onSubmit={addUser}>
				<TextField
					label='Navn'
					name='name'
					variant='outlined'
					size='small'
					sx={{ flex: 1 }}
				/>
				<Button size='small' variant='outlined' color='primary' type='submit'>
					Legg til
				</Button>
			</Box>
			<Box sx={{ my: 2 }}>
				<Button
					variant='contained'
					color='secondary'
					fullWidth
					onClick={() => {
						setStep("tombola")
					}}
				>
					Trekk
				</Button>
			</Box>
		</>
	)
}
