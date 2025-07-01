import React, { useEffect, useState, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TouchableOpacity,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { RFValue } from "react-native-responsive-fontsize"
import analytics from "@react-native-firebase/analytics"
import createAxiosInstance from "../utils/API"
import AsyncStorage from "@react-native-async-storage/async-storage"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default RegisterCode = (props) => {
	const [clinicianCode, setClinicianCode1] = useState("")
	const { setClinicianCode, signup, registrationObj, addRegistrationValues, user } = useContext(AuthContext)
	const userCode = user.data.api_token
	const navigation = useNavigation()
	React.useEffect(() => {
		// Use `setOptions` to update the button that we previously specified
		// Now the button includes an `onPress` handler to update the count
		navigation.setOptions({
			headerLeft: () => <></>,
		})
	}, [navigation])
	const validate = async () => {
		const api = createAxiosInstance(userCode)
		let connection = await api
			.post("/api/v1/client/relationships/", { clinician: { code: `${clinicianCode}` } })
			.then((data) => {
				if (data.status === 200) {
					setClinicianCode(clinicianCode)
					navigation.navigate("ClientHomeScreen")
				}
			})
			.catch((error) => {
				Alert.alert("Limb Lab: ", error.response.data.errors.code)
			})
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
				{/* <View style={styles.screenContainer}> */}

				<Input
					title="Clinician Code"
					style={{ marginBottom: 30, textTransform: "uppercase" }}
					onChangeText={(value) => setClinicianCode1(value.toUpperCase())}
					autoCapitalize={"characters"}
					value={clinicianCode}
					keyboardType="visible-password"
				/>

				<View style={{ marginTop: windowHeight * 0.05, alignItems: "center" }}>
					<TouchableOpacity
						style={{
							backgroundColor: Colors.darkGreen,
							borderRadius: 40,
							padding: 10,
							paddingHorizontal: 30,
							height: 50,
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() => {
							validate()
						}}
						fullWidthPadding={40}
					>
						<Text style={styles.buttonText}>CONTINUE</Text>
					</TouchableOpacity>
					<Text
						style={styles.skip}
						onPress={async () => {
							navigation.navigate("ClientHomeScreen"), analytics().logEvent("client_signup_cliniciancode_skip")
						}}
					>
						Skip
					</Text>
					<Text style={styles.noCode}>Don't have a clinician code?</Text>
					<Text style={styles.call}>Contact Megan during regular business hours at 507-951-8462 </Text>
					<Text style={styles.call}>or after hours at megan@limblab.com.</Text>
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	...Styles,
	skip: {
		...Styles.boldFont,
		fontSize: 18,
		color: Colors.olive,
		marginTop: windowHeight * 0.02,
		marginBottom: windowHeight * 0.1,
	},
	noCode: {
		...Styles.boldFont,
		fontSize: 20,
		marginBottom: windowHeight * 0.01,
	},
	call: {
		...Styles.mediumFont,
		fontSize: 12,
		width: windowWidth * 5,
		textAlign: "center",
	},

	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
