import React, { createContext, useState, useEffect } from "react"

import createAxiosInstance from "./API"
import { useNavigation } from "@react-navigation/native"
export const AuthContext = createContext({})
import analytics from "@react-native-firebase/analytics"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
import useAppMessageNotification from "./useAppMessageNotification"
import messaging from '@react-native-firebase/messaging';
const storeData = async (value) => {
	try {
		const jsonValue = JSON.stringify(value)
		await AsyncStorage.setItem("onboardingComplete", jsonValue)
	} catch (e) {}
}

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [registrationObj, setRegistrationObj] = useState(null)
	const [selectedClient, setSelectedClient] = useState(null)
	const [clientNotes, setClientNotes] = useState(null)
	const [clinicianCode, setClinicianCode] = useState(null)
	const [noClinician, setNoClinician] = useState(false)
	const {pushUnReaMessagesCountNotificationOnLogin,
		pushUnReaMessagesCountNotificationOnConversationUpdate
	} = useAppMessageNotification()

	useEffect(() => {
	const unsubscribe = messaging().onMessage(async remoteMessage => {
			pushUnReaMessagesCountNotificationOnConversationUpdate(remoteMessage.data.conversationSID)
		});

		// Background/Killed state messages
		messaging().setBackgroundMessageHandler(async remoteMessage => {
			console.log('Message received in background/killed:', remoteMessage);
			pushUnReaMessagesCountNotificationOnConversationUpdate(remoteMessage.data.conversationSID)
		});

		return unsubscribe;
	}, []);

	const api = createAxiosInstance()

	return (
		<AuthContext.Provider
			value={{
				user,
				registrationObj,
				setUser,
				selectedClient,
				setSelectedClient,
				clientNotes,
				setClientNotes,
				clinicianCode,
				setClinicianCode,
				noClinician,
				setNoClinician,
				login: (email, password, props, autoLogin = false, silent = false) => {
					api
						.post("/api/v1/sessions", { email, password })
						.then((data) => {
							if (data.api_token) {
								return data.api_token
							} else {
								setUser(data)
								analytics().logEvent("login")
							}
							if (typeof props === "function") {
								// console.warn("props", props)
								pushUnReaMessagesCountNotificationOnLogin(data.data.twilio_token, email)
								props(data.data)
							}
						})
						.catch((error) => {
							Alert.alert("Limb Lab", `Invalid Login\n${error?.message}`)
						})
				},
				signup: (registrationObj) => {
					api
						.post("/api/v1/clients", registrationObj)

						.then((res) => {
							if (res.api_token) {
								storeData(true)
								return res.api_token
							} else {
								setUser(res)
								storeData(true)
							}
						})

						.catch((error) => {
							if (error?.response?.data?.errors) {
								const e = error?.response?.data?.errors
								if (e?.email) {
									Alert.alert("Limb Lab", `Email ${e.email[0]}`)
								} else if (e?.password) {
									Alert.alert("Limb Lab", `Password ${e.password[0]}`)
								} else {
									Alert.alert(
										"Limb Lab",
										"We had a problem processing that request, please check your entries and try again"
									)
								}
							} else {
								Alert.alert("Limb Lab", "We had a problem processing that request, please try again")
							}
						})
				},

				logout: async (disableBiometrics = false) => {
					if (disableBiometrics) await AsyncStorage.setItem("biometricEnabled", "false")
					setUser(null)
				},

				addRegistrationValues(values) {
					setRegistrationObj({ ...registrationObj, ...values })
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
// const useAuthState = () => {
//   const context = React.useContext(authState)
//   if (context === undefined) {
//     throw new Error('useAuthState must be used within a authProvider')
//   }
//   return context
// }

// const useAuthDispatch = () => {
//   const context = React.useContext(authDispatch)
//   if (context === undefined) {
//     throw new Error('useAuthDispatch must be used within a authProvider')
//   }
//   return context
// }

// export {AuthProvider, useAuthState, useAuthDispatch}
