import React, { useEffect, useState } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SplashScreen from "../OnBoarding/SplashScreen"
import OnboardingScreen from "../OnBoarding/OnboardingScreen"
import LandingScreen from "../OnBoarding/LandingScreen"
import LoginScreen from "../OnBoarding/LoginScreen"
import RegisterName from "../OnBoarding/RegisterName"
import RegisterContact from "../OnBoarding/RegisterContact"
import RegisterPassword from "../OnBoarding/RegisterPassword"
import RegisterPrivacy from "../OnBoarding/RegisterPrivacy"
import RegisterCode from "../OnBoarding/RegisterCode"
import ClinicianConfirmScreen from "../OnBoarding/ClinicianConfirmScreen"
import GetClinicianPassword from "../Clincians/getClinicianPassword"
import ForgetPassword from "../OnBoarding/forgetPassword"
import { IconButton } from "react-native-paper"
import WebViewScreen from "../Client/WebViewScreen"
const Stack = createStackNavigator()

export const AuthStack = () => {
	const [loading, setLoading] = useState(true)
	const [showOnboarding, setShowOnboarding] = useState(false)
	const Stack = createStackNavigator()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem("onboardingComplete")

				if (!value) {
					setShowOnboarding(true)
				}
			} catch (error) {
				console.error("Error fetching data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return <SplashScreen />
	}
	return (
		<Stack.Navigator>
			{showOnboarding && (
				<Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
			)}
			<Stack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }} />
			<Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
			<Stack.Screen
				name="ForgetPassword"
				component={ForgetPassword}
				options={{ title: "Reset your Password", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="RegisterName"
				component={RegisterName}
				options={{ title: "Your Name", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="RegisterContact"
				component={RegisterContact}
				options={{ title: "Your Contact Info", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="RegisterPassword"
				component={RegisterPassword}
				options={{ title: "Your Password", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="RegisterPrivacy"
				component={RegisterPrivacy}
				options={{ title: "Privacy & Terms of Use", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="WebViewScreen"
				component={WebViewScreen}
				options={{ title: "Privacy & Terms of Use", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="ClinicianConfirmScreen"
				component={ClinicianConfirmScreen}
				options={{ title: "Clinicians or Providers" }}
			/>
			<Stack.Screen
				name="GetClinicianPassword"
				component={GetClinicianPassword}
				options={({ navigation }) => ({
					title: "Get Your Password",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("LoginScreen")
							}}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	)
}
