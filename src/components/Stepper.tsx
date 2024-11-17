import { useApp } from "@/context/AppContext"
import { Tombola } from "./Tombola"
import { Users } from "./Users"

export function Stepper() {
	const { step } = useApp()

	const Stepper: Record<string, JSX.Element> = {
		users: <Users />,
		tombola: <Tombola />,
	}

	return <>{Stepper[step]}</>
}
