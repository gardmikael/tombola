import { useApp } from "@/context/AppContext"
import { Tombola } from "./Tombola"
import { Users } from "./Users"
import { Transactions } from "./Transactions"

export function Stepper() {
	const { step, setStep } = useApp()

	const Stepper: Record<string, JSX.Element> = {
		users: <Users />,
		tombola: <Tombola />,
		transactions: <Transactions onClose={() => setStep("users")} />,
	}

	return <>{Stepper[step]}</>
}
