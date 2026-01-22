import React, { createContext, useContext, useState, useEffect, useMemo } from "react"

type AuthContextProps = {
	isAuthenticated: boolean
	login: (username: string, password: string) => Promise<boolean>
	logout: () => void
	checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/verify")
			if (response.ok) {
				setIsAuthenticated(true)
			} else {
				setIsAuthenticated(false)
			}
		} catch (error) {
			console.error("Auth check failed:", error)
			setIsAuthenticated(false)
		}
	}

	const login = async (username: string, password: string): Promise<boolean> => {
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			})

			if (response.ok) {
				setIsAuthenticated(true)
				return true
			}
			return false
		} catch (error) {
			console.error("Login failed:", error)
			return false
		}
	}

	const logout = () => {
		fetch("/api/auth/logout", { method: "POST" }).catch((error) => {
			console.error("Logout failed:", error)
		})
		setIsAuthenticated(false)
	}

	useEffect(() => {
		checkAuth()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const value = useMemo(
		() => ({ isAuthenticated, login, logout, checkAuth }),
		[isAuthenticated]
	)

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
