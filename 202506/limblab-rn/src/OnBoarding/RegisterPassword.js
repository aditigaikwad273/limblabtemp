import React, { useEffect, useState, useContext } from "react"
import {
	View,
	StyleSheet,
	Dimensions,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { RFValue } from "react-native-responsive-fontsize"
import { Button, Input } from "../componenets/Index"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import Icon from "react-native-vector-icons/FontAwesome"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const RegisterPassword = (props) => {
	const [password, setPassword] = React.useState("")
	const [password_confirmation, setpassword_confirmation] = React.useState("")
	const { addRegistrationValues, registrationObj } = useContext(AuthContext)
	const [secureTextEntry, setSecureTextEntry] = useState(true)
	const navigation = useNavigation()
	const validate = (props) => {
		// validate form values
		const match = () => {
			if (password !== password_confirmation) {
				Alert.alert("Limb Lab", "Passwords dont match")
			} else {
				return true
			}
		}
		const passwordLength = () => {
			if (password.length === 0 && password_confirmation.length === 0) {
				Alert.alert("Limb Lab", "Passwords are Invalid")
			} else {
				return true
			}
		}
		if (match(password, password_confirmation) && passwordLength(password, password_confirmation)) {
			addRegistrationValues({ password, password_confirmation })
			navigation.navigate("RegisterPrivacy", {
				password: password,
				password_confirmation: password_confirmation,
			})
		} else {
			Alert.alert("Limb Lab", "Passwords are invalid")
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
				<View style={{ alignItems: "center" }}>
					<Text style={styles.title}>Create Your Password</Text>
					<View style={{ flexDirection: "row" }}>
						<TextInput
							placeholderTextColor="#000"
							style={styles.input}
							paddingLeft={5}
							secureTextEntry={secureTextEntry}
							autoComplete={"off"}
							autoCorrect={false}
							placeholder="Password"
							onChangeText={setPassword}
							value={password}
						/>

						<TouchableOpacity
							onPress={() => setSecureTextEntry(!secureTextEntry)}
							style={{ position: "absolute", right: 10, top: 17 }}
						>
							<Icon name={secureTextEntry ? "eye-slash" : "eye"} size={20} color={Colors.darkGreen} />
						</TouchableOpacity>
					</View>
					<Text style={styles.title}>Re-Enter Your Password</Text>
					<View style={{ flexDirection: "row" }}>
						<TextInput
							placeholderTextColor="#000"
							style={styles.input}
							paddingLeft={5}
							secureTextEntry={secureTextEntry}
							autoComplete={"off"}
							autoCorrect={false}
							placeholder="Confirm Password"
							onChangeText={setpassword_confirmation}
							value={password_confirmation}
						/>

						<TouchableOpacity
							onPress={() => setSecureTextEntry(!secureTextEntry)}
							style={{ position: "absolute", right: 10, top: 17 }}
						>
							<Icon name={secureTextEntry ? "eye-slash" : "eye"} size={20} color={Colors.darkGreen} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ marginTop: windowHeight * 0.05 }}>
					<Button title="CONTINUE" onPress={validate} fullWidthPadding={40} />
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

export default RegisterPassword

const styles = StyleSheet.create({
	...Styles,
	title: {
		...Styles.boldFont,
		fontSize: RFValue(24),
		textAlign: "center",
		marginBottom: 10,
		marginTop: 10,
	},
	input: {
		borderColor: Colors.grey,
		borderWidth: 1,
		width: windowWidth * 0.9,
		height: 50,
		fontSize: 24,
		height: 50,
	},
})
