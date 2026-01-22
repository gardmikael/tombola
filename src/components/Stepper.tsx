import { useApp } from "@/context/AppContext"
import { Tombola } from "./Tombola"
import { Users } from "./Users"
import { Transactions } from "./Transactions"
import { ReactElement } from "react"

export function Stepper() {
	const { step, setStep } = useApp()

	const Stepper: Record<string, ReactElement> = {
		users: <Users />,
		tombola: <Tombola />,
		transactions: <Transactions onClose={() => setStep("users")} />,
	}

	return <>{Stepper[step]}</>
}
