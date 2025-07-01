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
import createAxiosInstance from "../utils/API"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default ClinicianCode = (props) => {
	const [clinicianCode, setClinicianCode1] = useState("")
	const { setClinicianCode, user } = useContext(AuthContext)
	const userCode = user.data.api_token
	const navigation = useNavigation()

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
					onChangeText={(value) => setClinicianCode1(value.toUpperCase())}
					style={{ marginBottom: 30 }}
					autoCapitalize={"characters"}
					value={clinicianCode}
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
						onPress={validate}
						fullWidthPadding={40}
					>
						<Text style={styles.buttonText}>CONTINUE</Text>
					</TouchableOpacity>
					<View
						style={{
							justifyContent: "center",
							marginTop: windowHeight * 0.02,
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={styles.noCode}>Don't have a clinician code?</Text>
						<Text style={styles.call}>
							Contact Megan during regular business hours at 507-951-8462 or after hours at megan@limblab.com.
						</Text>
					</View>
					{/* <Text style={styles.call}>or after hours at megan@limblab.com.</Text> */}
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
		fontSize: 18,
		marginBottom: windowHeight * 0.01,
	},
	call: {
		...Styles.mediumFont,
		fontSize: 14,
		textAlign: "center",
	},

	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
