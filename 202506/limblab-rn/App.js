import "react-native-gesture-handler"
import React from "react"
import { Routes } from "./src/utils/routes"
import { View, StyleSheet, Text, RefreshControl, Dimensions, Image, Platform } from "react-native"
import { AuthProvider } from "./src/utils/authContext"

const App = () => {
	return (
		<AuthProvider>
			<Routes />
		</AuthProvider>
	)
}

export default App
