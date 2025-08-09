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
	Button as B,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
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
import Modal from "react-native-modal"
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics"
import createAxiosInstance from "../utils/API"

const LoginScreen = (props) => {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [secureTextEntry, setSecureTextEntry] = useState(true)
	const [errortext, setErrortext] = useState("")
	const [enableBiometric, setEnableBiometric] = useState(false)
	const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
	const [isBiometricDataAvailable, setIsBiometricDataAvailable] = useState(false)
	const [visibleBiometricPopup, setVisibleBiometricPopup] = useState(false)

	const [biometryType, setBiometryType] = useState("")
	const navigation = useNavigation()
	const { login } = useContext(AuthContext)
	const postData = {
		email: email,
		password: password,
	}
	const rnBiometrics = new ReactNativeBiometrics()
	useEffect(() => {
		rnBiometrics.isSensorAvailable().then((resultObject) => {
			const { available, biometryType } = resultObject

			if (available && biometryType === BiometryTypes.TouchID) {
				AsyncStorage.setItem("BiometryType", "TouchID")
				setBiometryType("TouchID")
			} else if (available && biometryType === BiometryTypes.FaceID) {
				AsyncStorage.setItem("BiometryType", "FaceID")
				setBiometryType("FaceID")
			} else if (available && biometryType === BiometryTypes.Biometrics) {
				AsyncStorage.setItem("BiometryType", "TouchID")
				setBiometryType("TouchID")
			} else {
				AsyncStorage.setItem("BiometryType", "")
				setBiometryType("")
			}
		})

		GetUser().then((res) => {
			if (res.success) setIsBiometricDataAvailable(true)
		})
	}, [])
	useEffect(() => {
		BiometricIsAvailable().then(async (res) => {
			setIsBiometricAvailable(res)
			const value = await AsyncStorage.getItem("biometricEnabled")
			if (value == "true") {
				setEnableBiometric(true)
				LoginBiometricAuth()
					.then((res) => {
						login(res.username, res.password, (loggedUserData) => loginCallback(res.username, res.password, true, loggedUserData))
					})
					.catch((e) => {
						console.warn(e.toString())
					})
			}
		})
	}, [])

	const forgetPassword = () => {
		// validate form values
		navigation.navigate("ForgetPassword")
	}

	const onBiometricLogin = () => {
		BiometricIsAvailable().then(async (res) => {
			LoginBiometricAuth()
				.then((res) => {
					console.log(res)
					login(res.username, res.password, (loggedUserData) => loginCallback(res.username, res.password, true, loggedUserData))
				})
				.catch((e) => {
					console.warn(e.toString())
				})
		})
	}

	const onPressLogin = () => {
		if (enableBiometric) {
			setVisibleBiometricPopup(true)
		} else {
			login(email, password, (loggedUserData) => loginCallback(email, password, enableBiometric, loggedUserData))
		}
	}
	const loginCallback = async (email, password, enableBiometric, loggedUserData) => {
		if (!enableBiometric) {
			AsyncStorage.setItem("biometricEnabled", "false")
			console.warn("ider aya false ", enableBiometric)
			// return
		} else {
			AsyncStorage.setItem("biometricEnabled", "true")
			AsyncStorage.setItem("isFirstOpen", "false")
		}
		
		const api = createAxiosInstance(loggedUserData.api_token)
		const dt = await AsyncStorage.getItem("deviceToken");
		api.post(`/api/v1/${loggedUserData.role}/devices`, {
			device: {
				token: dt
			}
		})
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
	const onOkPress = () => {
		setVisibleBiometricPopup(false)
		login(email, password, (loggedUserData) => loginCallback(email, password, enableBiometric, loggedUserData))
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
				<Modal isVisible={visibleBiometricPopup}>
					<View
						style={{ backgroundColor: "white", borderRadius: 20, alignItems: "center", padding: 24, paddingBottom: 0 }}
					>
						<Image source={Images.icnFaceID} style={{ width: 50, height: 50 }} />
						<Text style={[{ fontSize: 25, color: Colors.black, marginTop: 16, fontWeight: "600" }]}>
							{`${biometryType == "FaceID" ? "Face ID" : "Touch ID"} for "LimbLab"`}
						</Text>
						<Text style={[{ color: Colors.black, marginTop: 16, fontSize: 16, textAlign: "center" }]}>
							{`You have turned on ${
								biometryType == "FaceID" ? "Face ID" : "Touch ID"
							} to sign into this app next time. You can turn off ${
								biometryType == "FaceID" ? "Face ID" : "Touch ID"
							} in your app settings`}
						</Text>
						<Pressable
							onPress={onOkPress}
							style={{
								alignSelf: "stretch",
								alignItems: "center",
								padding: 10,
								borderTopColor: Colors.lightGrey,
								borderTopWidth: 1,
								marginTop: 16,
							}}
						>
							<Text
								style={{
									color: Platform.OS == "android" ? "#2196F3" : "#007AFF",
									fontWeight: "600",
									fontSize: 24,
								}}
							>
								OK
							</Text>
						</Pressable>
					</View>
				</Modal>
				<View
					style={{
						alignItems: "center",
						height: windowHeight * 0.1,
						marginTop: windowHeight * 0.06,
						width: windowWidth,
					}}
				>
					<Image source={Images.logoBig} style={{ width: windowWidth * 0.8 }} />
				</View>
				<View style={styles.screenContainer}>
					<Text style={styles.title}>The journey begins with you.</Text>
					<View style={{ marginTop: windowHeight * 0.1, alignItems: "center" }}>
						<View style={{ flexDirection: "row" }}>
							<TextInput
								placeholderTextColor="#000"
								autoCapitalize="none"
								autoComplete="email"
								style={styles.inputForm}
								placeholder="Email"
								onChangeText={(email) => setEmail(email)}
								value={email}
							/>

							{isBiometricDataAvailable && (
								<TouchableOpacity
									onPress={() => onBiometricLogin()}
									style={{ position: "absolute", right: 10, top: 20 }}
								>
									<Image source={Images.icnFaceID} style={{ height: 20, width: 20, resizeMode: "contain" }} />
								</TouchableOpacity>
							)}
						</View>
						<View style={{ flexDirection: "row" }}>
							<TextInput
								placeholderTextColor="#000"
								style={styles.inputForm}
								secureTextEntry={secureTextEntry}
								placeholder="Password"
								onChangeText={(password) => setPassword(password)}
								value={password}
							/>

							<TouchableOpacity
								onPress={() => setSecureTextEntry(!secureTextEntry)}
								style={{ position: "absolute", right: 10, top: 17 }}
							>
								<Icon name={secureTextEntry ? "eye-slash" : "eye"} size={20} color={Colors.darkGreen} />
							</TouchableOpacity>
						</View>
						{isBiometricAvailable && (
							<Pressable
								style={{
									flexDirection: "row",
									alignSelf: "flex-start",
									marginBottom: 16,
									alignItems: "center",
									justifyContent: "center",
								}}
								onPress={() => setEnableBiometric(!enableBiometric)}
							>
								<View
									style={{
										width: 20,
										height: 20,
										borderRadius: 10,
										borderWidth: 2,
										borderColor: Colors.darkGreen,
										justifyContent: "center",
									}}
								>
									{enableBiometric && (
										<View
											style={{
												width: 14,
												height: 14,
												backgroundColor: Colors.darkGreen,
												borderRadius: 7,
												alignSelf: "center",
											}}
										/>
									)}
								</View>
								<Text
									style={[
										{ ...Styles.regularFont, fontSize: 16, color: Colors.olive, textAlign: "center", marginLeft: 10 },
									]}
								>
									Biometric Login
								</Text>
							</Pressable>
						)}
					</View>
					<Button title="SIGN IN" fullWidthPadding={40} onPress={onPressLogin} />
					<TouchableOpacity onPress={forgetPassword}>
						<Text style={styles.confirmText}>Forgot Password?</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	...Styles,
	screenContainer: {
		flex: 1,
		// justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	title: {
		...Styles.boldFont,
		fontSize: 20,
		color: Colors.darkGreen,
		lineHeight: 44,
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
		marginLeft: 10,
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
		marginTop: 40,
	},
	inputForm: {
		padding: Platform.OS === "ios" ? 15 : 5,
		marginBottom: 20,
		borderColor: Colors.grey,
		borderWidth: 1,
		width: windowWidth * 0.8,
		height: 60,
		...Styles.mediumFont,
		flex: 1,
		fontSize: 18,
	},
})
