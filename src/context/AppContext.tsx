import { defaultUsers } from "@/data/default-users"
import React, { createContext, useContext, useState } from "react"

type Step = "users" | "tombola" | "transactions"

type AppContextProps = {
	users: { name: string; tickets: number; active: boolean }[]
	toggleActive: (index: number) => void
	addUser: (e: React.FormEvent) => void
	step: Step
	setStep: React.Dispatch<React.SetStateAction<Step>>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const usersWithTickets = defaultUsers.map((user) => {
		return { name: user, tickets: 1, active: false }
	})
	const [users, setUsers] = useState(usersWithTickets)
	const [step, setStep] = useState<Step>("users")

	const toggleActive = (index: number) => {
		const updatedUsers = users.map((user, i) =>
			i === index ? { ...user, active: !user.active } : user
		)

		setUsers(updatedUsers)
	}

	const addUser = (e: React.FormEvent) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		const name = formData.get("name") as string
		setUsers([...users, { name, tickets: 1, active: true }])
		form.reset()
	}

	return (
		<AppContext.Provider
			value={{ users, toggleActive, addUser, step, setStep }}
		>
			{children}
		</AppContext.Provider>
	)
}

export const useApp = () => {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error("useApp must be used within a AppProvider")
	}
	return context
}
