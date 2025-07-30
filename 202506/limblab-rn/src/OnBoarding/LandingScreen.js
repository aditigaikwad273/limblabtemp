import React, { useEffect, useState, useContext } from "react"
import { View, StyleSheet, Text, Image, Pressable, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import Button from "../componenets/Button"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import analytics from "@react-native-firebase/analytics"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BiometricIsAvailable, LoginBiometricAuth, SetUser, UpdateUser } from "react-native-biometric-login"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const LandingScreen = (props) => {
	const navigation = useNavigation()
	const { login } = useContext(AuthContext)

	const forgetPassword = () => {
		// validate form values
		navigation.navigate("GetClinicianPassword")
	}

	useEffect(() => {
		BiometricIsAvailable().then(async (res) => {
			const value = await AsyncStorage.getItem("biometricEnabled")
			if (value == "true") {
				LoginBiometricAuth()
					.then((res) => {
						login(res.username, res.password, () => loginCallback(res.username, res.password))
					})
					.catch((e) => {
						console.warn(e.toString())
					})
			}
		})
	}, [])

	const loginCallback = (email, password) => {
		AsyncStorage.setItem("biometricEnabled", "true")
		AsyncStorage.setItem("isFirstOpen", "false")
		SetUser(email, password)
			.then((res) => {
				console.warn(JSON.stringify(res))
			})
			.catch((e) => {
				UpdateUser(email, password)
					.then((res) => {
						console.warn(JSON.stringify(res))
					})
					.catch((e) => {
						console.warn(e.toString())
					})
				console.warn(e.toString())
			})
	}

	return (
		<SafeAreaView style={styles.mainContainer}>
			<View
				style={{ alignItems: "center", height: windowHeight * 0.1, marginTop: windowHeight * 0.06, width: windowWidth }}
			>
				<Image source={Images.logoBig} style={{ width: windowWidth * 0.8 }} />
			</View>
			<View style={styles.screenContainer}>
				<Text style={styles.title}>The journey begins with you.</Text>
				<View>
					<Button title="SIGN IN" fullWidthPadding={40} onPress={() => props.navigation.navigate("LoginScreen")} />
					<Pressable
						style={styles.signInButton}
						onPress={async () => {
							props.navigation.navigate("RegisterName"), await analytics().logEvent("client_signup_start")
						}}
					>
						<Text style={styles.signInText}>Sign Up</Text>
						<Text style={styles.signedUpText}>Now to Get Connected </Text>
					</Pressable>
				</View>
				<Pressable style={styles.confirmButton} onPress={forgetPassword}>
					<Text style={styles.clinicianText}>Clinicians or Providers</Text>
					<Text style={styles.confirmText}>Confirm Your Account</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	)
}

export default LandingScreen
const styles = StyleSheet.create({
	...Styles,
	screenContainer: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	title: {
		...Styles.boldFont,
		fontSize: 38,
		color: Colors.darkGreen,
		lineHeight: 44,
		width: windowWidth * 0.8,
	},
	signInButton: {
		flexDirection: "row",
		marginTop: 15,
		justifyContent: "center",
	},
	signedUpText: {
		...Styles.boldFont,
		fontSize: 18,
		color: Colors.darkGreen,
	},
	signInText: {
		...Styles.boldFont,
		fontSize: 18,
		color: Colors.olive,
		marginRight: 5,
	},
	confirmButton: {
		marginBottom: 20,
	},
	clinicianText: {
		...Styles.boldFont,
		fontSize: 20,
		color: Colors.darkGreen,
		textAlign: "center",
	},
	confirmText: {
		...Styles.boldFont,
		fontSize: 18,
		color: Colors.olive,
		textAlign: "center",
	},
})
