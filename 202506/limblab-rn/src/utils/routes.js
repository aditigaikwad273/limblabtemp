import React, { useContext, useState, useEffect, Fragment } from "react"
import { NavigationContainer } from "@react-navigation/native"
import analytics from "@react-native-firebase/analytics"
import { AuthStack } from "./authStack"
import { MainStack } from "./mainStack"
import { AuthContext } from "./authContext"
import moment from "moment"
import { AppState } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const Routes = () => {
	const { user, setUser, logout } = useContext(AuthContext)
	const firstTimeUser = user?.data ? user.data.firstTimeUser : false
	const routeNameRef = React.useRef()
	const navigationRef = React.useRef()

	useEffect(() => {
		const appStateListener = AppState.addEventListener("change", (nextAppState) => {
			if (AppState.currentState == "inactive" || AppState.currentState == "background") {
				storeTimeStamp(Date.now())
			} else if (AppState.currentState == "active") {
				getTimeStamp()
			}
		})
		return () => {
			appStateListener?.remove()
		}
	}, [])

	const storeTimeStamp = async (value) => {
		try {
			await AsyncStorage.setItem("loginTimeStamp", String(value))
		} catch (e) {
			// saving error
		}
	}

	const getTimeStamp = async () => {
		try {
			const value = await AsyncStorage.getItem("loginTimeStamp")
			let min = (Date.now() - parseInt(value)) / 1000 / 60
			if (min >= 5) logout()
		} catch (e) {}
	}

	return (
		<NavigationContainer
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current = navigationRef.current.getCurrentRoute()?.name
			}}
			onStateChange={async () => {
				const previousRouteName = routeNameRef.current
				const currentRouteName = navigationRef.current.getCurrentRoute()?.name

				if (previousRouteName !== currentRouteName) {
					await analytics().logScreenView({
						screen_name: currentRouteName,
						screen_class: currentRouteName,
					})
				}
				routeNameRef.current = currentRouteName
			}}
		>
			{!user ? <AuthStack /> : <MainStack />}
		</NavigationContainer>
	)
}
