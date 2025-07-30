import React, { useEffect, useState, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Image,
	Pressable,
	TextInput,
	Dimensions,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import {
	BiometricIsAvailable,
	BasicBiometricAuth,
	LoginBiometricAuth,
	SetUser,
	UpdateUser,
	GetUser,
	DeleteUser,
} from "react-native-biometric-login"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics"

const BiometricScreen = () => {
	const [isFirstOpen, setIsFirstOpen] = useState("false")
	const navigation = useNavigation()
	const { user, setUser, noClinician, setNoClinician } = useContext(AuthContext)
	const [biometryType, setBiometryType] = useState("")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem("isFirstOpen")
				setIsFirstOpen(value)
				console.warn("isFirstOpen", value)

				if (value !== "true") {
					if (user.data.role !== "client") {
						navigation.navigate("ClinicianHomeScreen")
					} else if (noClinician) {
						navigation.navigate("RegisterCode")
					} else {
						navigation.navigate("ClientHomeScreen")
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		fetchData()
	}, [])

	const rnBiometrics = new ReactNativeBiometrics()

	useEffect(() => {
		rnBiometrics.isSensorAvailable().then((resultObject) => {
			const { available, biometryType } = resultObject

			if (available && biometryType === BiometryTypes.TouchID) {
				// AsyncStorage.setItem("BiometryType", "TouchID")
				setBiometryType("TouchID")
			} else if (available && biometryType === BiometryTypes.FaceID) {
				// AsyncStorage.setItem("BiometryType", "FaceID")
				setBiometryType("FaceID")
			} else if (available && biometryType === BiometryTypes.Biometrics) {
				// AsyncStorage.setItem("BiometryType", "TouchID")
				setBiometryType("TouchID")
			} else {
				// AsyncStorage.setItem("BiometryType", "")
				setBiometryType("FaceID")
			}
		})
	}, [])

	const onSkipPress = () => {
		AsyncStorage.setItem("isFirstOpen", "false")
		user.data.role != "client"
			? navigation.navigate("ClinicianHomeScreen")
			: noClinician
			? navigation.navigate("RegisterCode")
			: navigation.navigate("ClientHomeScreen")
	}
	const setFaceID = () => {
		AsyncStorage.setItem("biometricEnabled", "true")
		AsyncStorage.setItem("isFirstOpen", "false")
		user.data.role != "client"
			? navigation.navigate("ClinicianHomeScreen")
			: noClinician
			? navigation.navigate("RegisterCode")
			: navigation.navigate("ClientHomeScreen")
	}
	return (
		<SafeAreaView style={styles.container}>
			<Image source={biometryType == "FaceID" ? Images.icnFaceID : Images.icnTouchID} style={{ marginTop: 100 }} />
			<Text style={styles.title}>{biometryType == "FaceID" ? "Biometric Login" : "Biometric Login"}</Text>
			<Text style={styles.subTitle}>Faster Sign In</Text>
			<Text style={styles.textStyle}>{`Save time signing in next time,\nenable ${
				biometryType == "FaceID" ? "Biometric Login" : "Biometric Login"
			}.`}</Text>

			<Button
				title={`Yes, Turn on ${biometryType == "FaceID" ? "Biometric Login" : "Biometric Login"}`}
				fullWidthPadding={40}
				onPress={setFaceID}
			/>

			<Pressable style={styles.textStyleNotnow} onPress={onSkipPress}>
				<Text style={styles.text2}>Not Now</Text>
			</Pressable>
			<Text style={styles.textStyle}>{`You can turn on ${
				biometryType == "FaceID" ? "Biometric Login" : "Biometric Login"
			}\nin your app settings later.`}</Text>
		</SafeAreaView>
	)
}

export default BiometricScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
		// justifyContent: 'center',
		// height:'80%'
	},
	textStyle: {
		...Styles.mediumFont,
		color: Colors.dropShadowColor,
		fontSize: 15,
		textAlign: "center",
		marginVertical: 30,
	},
	buttonStyle: {
		backgroundColor: "darkgreen",
		width: "80%",
		height: "5%",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		...Styles.boldFont,
		color: Colors.olive,
		fontSize: 35,
		// fontWeight: 'bold',
		marginTop: 60,
	},
	subTitle: {
		...Styles.boldFont,
		color: Colors.grey,
		fontSize: 25,
		// fontWeight: 'bold',
		// marginTop: 60,
	},
	textStyleNotnow: {
		textAlign: "center",
		fontSize: 15,
		fontWeight: "bold",
		marginTop: 30,
		marginBottom: -15,
	},
	text2: {
		...Styles.boldFont,
		fontSize: 15,
		color: Colors.olive,
	},
})
