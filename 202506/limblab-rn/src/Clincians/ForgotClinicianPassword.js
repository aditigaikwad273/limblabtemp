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
	TouchableOpacity,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"

import { useNavigation } from "@react-navigation/native"
import createAxiosInstance from "../utils/API"
import { AuthContext } from "../utils/authContext"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const ForgotClinicianPassword = (props) => {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [loading, setLoading] = useState(false)
	const [errortext, setErrortext] = useState("")
	const navigation = useNavigation()
	const { login } = useContext(AuthContext)

	const navigateLogin = () => {
		navigation.navigate("LoginScreen")
	}

	const forgetPassword = () => {
		const api = createAxiosInstance()
		api
			.post("/api/v1/clinician/passwords/", { password: { email: email } })
			.then((data) => {
				if (data.status == 200) {
					Alert.alert("Limb Lab", "Please check your email and reset your password..")
					return data
				} else {
					setUser(data)
				}
			})
			.catch((error) => {
				Alert.alert("Limb Lab", `${email} ${error.response?.data?.errors?.email[0]}`)
				// console.error('what is this error', error);
			})
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
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
					<View style={{ marginTop: windowHeight * 0.1, alignItems: "center" }}>
						<TextInput
							placeholderTextColor="#000"
							autoCapitalize="none"
							style={styles.inputForm}
							placeholder="email"
							onChangeText={(email) => setEmail(email)}
							value={email}
						/>
						<Button title="Get Password" fullWidthPadding={40} onPress={forgetPassword} />
					</View>
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

export default ForgotClinicianPassword

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
		fontSize: 18,
	},
})
