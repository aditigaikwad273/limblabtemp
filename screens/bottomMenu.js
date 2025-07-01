import React, { useEffect, useState, useContext } from "react"
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { RFValue } from "react-native-responsive-fontsize"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default BottomMenu = (props) => {
	const [clinicianCode, setClinicianCode] = useState("")
	const { signup, registrationObj, addRegistrationValues } = useContext(AuthContext)
	const navigation = useNavigation()
	const validate = (props) => {
		addRegistrationValues({ password, password_confirmation })
		navigation.navigate("RegisterPrivacy", {
			password: password,
			password_confirmation: password_confirmation,
		})
	}

	return (
		<SafeAreaView style={styles.mainContainer}>
			<Input title="Clinician Code" onChangeText={setClinicianCode} style={{ marginBottom: 30 }} />

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
					onPress={() => signup(registrationObj)}
					fullWidthPadding={40}
				>
					<Text style={styles.buttonText}>CONTINUE</Text>
				</TouchableOpacity>
				<Text style={styles.skip} onPress={() => signup(registrationObj)}>
					Skip
				</Text>
				<Text style={styles.noCode}>Dont have a Code?</Text>
				<Text style={styles.call}>Call 123-456-7890 to get setup</Text>
			</View>
		</SafeAreaView>
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
		fontSize: 18,
	},

	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
