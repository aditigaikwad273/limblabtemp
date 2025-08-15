import React, { useContext, useState, useEffect, Fragment } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TouchableOpacity, Text } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import ClinicianHomeScreen from "../Clincians/ClinicianHomeScreen"
import ClientHomeScreen from "../Client/ClientHomeScreen"
import analytics from "@react-native-firebase/analytics"
import ResourcesScreen from "../Client/ResourcesScreen"
import FoldersScreen from "../Client/FoldersScreen"
import VideosScreen from "../Client/VideosScreen"
import VideoDetailsScreen from "../Client/VideoDetailsScreen"
import SettingsScreen from "../Client/SettingsScreen"
import MessageScreen from "../Chat/MessageScreen"
import ClientNotesScreen from "../Clincians/ClientNotesScreen"
import { AuthContext } from "./authContext"
import { IconButton } from "react-native-paper"
import WebViewScreen from "../Client/WebViewScreen"
import createAxiosInstance from "../utils/API"
import ClincianSettings from "../Clincians/ClincianSettings"
import ForgetPassword from "../OnBoarding/forgetPassword"
import RegisterCode from "../OnBoarding/RegisterCode"
import ClinicianConfirmScreen from "../OnBoarding/ClinicianConfirmScreen"
import ClinicianCode from "../Client/ClinicianCode"
import ForgotClinicianPassword from "../Clincians/ForgotClinicianPassword"
import NotificationManagementScreen from "../Client/NotificationManagementScreen"
import SplashScreen from "../OnBoarding/SplashScreen"
import BiometricScreen from "../OnBoarding/BiometricScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import useAppStateAwareFocusEffect from "react-navigation-app-state-aware-focus-effect"


const Stack = createStackNavigator()

const ClientStack = () => {
	// const [loading, setLoading] = useState(true)
	const { user, mainUser, setMainUser, logout, selectedClient, clientNotes, noClinician, setNoClinician } =
		useContext(AuthContext)
	const userCode = user.data.api_token
	useEffect(() => {
		const fetchData = async () => {
			try {
				const api = createAxiosInstance(userCode)
				const response = await api.get("/api/v1/client/relationships")

				if (response.data.length < 1) {
					setNoClinician(true)
				} else {
					setNoClinician(false)
				}
			} catch (error) {}
		}

		fetchData()
	}, [noClinician, userCode])

	useEffect(() => {
		if (!user) return
		if (user.data.role == "client") analytics().setUserProperty("Is_Client", "true")
		else analytics().setUserProperty("Is_Clinician", "true")
	}, [user])

	// if (loading) {
	// 	return <SplashScreen />
	// }

	return (
		<Stack.Navigator>
			<Stack.Screen name="BiometricScreen" component={BiometricScreen} options={{ headerShown: false }} />
			{noClinician && (
				<Stack.Screen
					name="RegisterCode"
					component={RegisterCode}
					options={{ title: "Your Clinician", headerBackTitleVisible: false }}
				/>
			)}
			<Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} options={{ headerShown: false }} />
			<Stack.Screen name="ResourcesScreen" component={ResourcesScreen} options={{ title: "Resources" }} />
			<Stack.Screen name="FoldersScreen" component={FoldersScreen} options={{ title: "Videos" }} />
			<Stack.Screen name="VideosScreen" component={VideosScreen} options={{ title: "Videos" }} />
			<Stack.Screen name="VideoDetailsScreen" component={VideoDetailsScreen} options={{ title: "Video" }} />
			<Stack.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				options={{ title: "Settings", headerLeft: null }}
			/>
			<Stack.Screen
				name="ClinicianCode"
				component={ClinicianCode}
				options={{ title: "Clinician Code", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="WebViewScreen"
				component={WebViewScreen}
				options={{ title: "Resources", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="NotificationScreen"
				component={NotificationManagementScreen}
				options={{ title: "", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="MessageScreen"
				component={MessageScreen}
				options={({ navigation }) => ({
					title: "Messages",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("ClientHomeScreen")
							}}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="ClinicianConfirmScreen"
				component={ClinicianConfirmScreen}
				options={{ title: "Clinicians or Providers" }}
			/>
			<Stack.Screen
				name="ForgetPassword"
				component={ForgetPassword}
				options={({ navigation }) => ({
					title: "Reset Password",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("SettingsScreen")
							}}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	)
}

const ClinicianStack = () => {
	const { user, mainUser, setMainUser, logout, selectedClient, clientNotes } = useContext(AuthContext)
	const [isFirstOpen, setIsFirstOpen] = useState("false")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem("isFirstOpen")
				setIsFirstOpen(value)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		fetchData()
	}, [])

	const sendNotes = async () => {
		const api = createAxiosInstance(user.data.api_token)
		await api.put("/api/v1/clinician/relationships/" + selectedClient.id, { notes: clientNotes })
	}
	//{isFirstOpen == "true" ? "BiometricScreen" : "ClinicianHomeScreen"}
	return (
		<Stack.Navigator>
			<Stack.Screen name="BiometricScreen" component={BiometricScreen} options={{ headerShown: false }} />
			<Stack.Screen name="ClinicianHomeScreen" component={ClinicianHomeScreen} options={{ headerShown: false }} />
			<Stack.Screen
				name="NotificationScreen"
				component={NotificationManagementScreen}
				options={{ title: "", headerBackTitleVisible: false }}
			/>
			<Stack.Screen
				name="ClinicianSettings"
				component={ClincianSettings}
				options={({ navigation }) => ({
					title: "Settings",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("ClinicianHomeScreen")
							}}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="ClinicianMessageScreen"
				component={MessageScreen}
				options={({ navigation }) => ({
					title: "Messages",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("ClinicianHomeScreen")
							}}
						/>
					),

					headerRight: () => (
						<IconButton
							icon="message-plus"
							size={28}
							color="#96933F"
							onPress={() => navigation.navigate("ClientNotesScreen")}
						/>
					),
				})}
			/>
			<Stack.Screen
				name="ClientNotesScreen"
				component={ClientNotesScreen}
				options={({ navigation }) => ({
					title: "Client Notes",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								sendNotes(), navigation.navigate("ClinicianMessageScreen")
							}}
						/>
					),

					headerRight: () => (
						<TouchableOpacity
							style={{ marginRight: 10 }}
							onPress={() => {
								sendNotes(), navigation.navigate("ClinicianHomeScreen")
							}}
						>
							<Text>Done</Text>
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name="ForgotClinicianPassword"
				component={ForgotClinicianPassword}
				options={({ navigation }) => ({
					title: "Reset Password",
					headerShown: true,
					headerLeft: () => (
						<IconButton
							icon="arrow-left"
							size={28}
							color="#96933F"
							onPress={() => {
								navigation.navigate("ClinicianSettings")
							}}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	)
}

export const MainStack = () => {
	const { user, noClinician, pushUnReaMessagesCountNotificationOnLogin } = useContext(AuthContext)

	useAppStateAwareFocusEffect(
		React.useCallback(() => {
			let active = true
			;(async () => {
				pushUnReaMessagesCountNotificationOnLogin(user.data?.twilio_token)
			})()

			return () => {
				active = false
			}
		}, [])
	)

	return (
		<Stack.Navigator>
			{user.data.role == "client" && !noClinician ? (
				<Stack.Screen name="RegisterCode" component={ClientStack} options={{ headerShown: false }} />
			) : user.data.role == "client" ? (
				<Stack.Screen name={"ClientHomeScreen"} component={ClientStack} options={{ headerShown: false }} />
			) : (
				<Stack.Screen name={"ClinicianHomeScreen"} component={ClinicianStack} options={{ headerShown: false }} />
			)}
		</Stack.Navigator>
	)
}
