import React, { useEffect, useState, useContext } from "react"
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { ListItem, Icon } from "react-native-elements"
import { Button } from "../componenets/Index"
import { CheckBox } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { RFValue } from "react-native-responsive-fontsize"
import analytics from "@react-native-firebase/analytics"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default RegisterPrivacy = (props) => {
	const [checked, setChecked] = useState(false)
	const { signup, registrationObj, addRegistrationValues } = useContext(AuthContext)
	const list = [
		{
			title: "HIPAA Compliance/Data Security",
			link: "https://limblab.com/hipaa-privacy-notice/",
		},
		{
			title: "Privacy Policy (General)",
			link: "https://limblab.com/privacy-policy/",
		},
		{
			title: "Terms & Conditions",
			link: "https://limblab.com/terms-conditions/",
		},
	]

	const navigation = useNavigation()
	const validate = async (props) => {
		// validate form values
		if (!checked) {
			Alert.alert("Limb Lab", "Please check the checkbox")
		} else {
			await addRegistrationValues({ checked })
			await signup(registrationObj)
		}

		analytics().logEvent("client_signup_complete")
	}

	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={styles.screenContainer}>
				<Text style={styles.title}>Please confirm you have read the following items:</Text>
				{/* <Text style={styles.title}>options:</Text> */}
			</View>
			<View style={{ width: windowWidth * 0.9, marginLeft: windowWidth * 0.1 }}>
				{list.map((item, i) => (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("WebViewScreen", { params: item.link })
						}}
					>
						<ListItem key={i} bottomDivider>
							<ListItem.Content>
								<ListItem.Title style={{}}>{item.title}</ListItem.Title>
							</ListItem.Content>
							<Icon size={26} name="chevron-right" type="feather" color={'gray'} />
						</ListItem>
					</TouchableOpacity>
				))}
			</View>

			<CheckBox
				containerStyle={{
					backgroundColor: Colors.white,
					borderColor: Colors.white,
					width: windowWidth * 0.85,
					marginLeft: windowWidth * 0.07,
					marginBottom: windowHeight * 0.05,
					marginTop: windowHeight * 0.03,
				}}
				title="Yes, I have read and agree to the HIPAA Notice, Privacy Policy, and Terms & Conditions for the app."
				textStyle={styles.checkBoxText}
				checked={checked}
				onPress={() => setChecked(!checked)}
			/>

			{/* <TouchableOpacity style={{backgroundColor: Colors.darkGreen,
		borderRadius: 40,
		padding: 10,
		paddingHorizontal: 30,
		height: 50,
		justifyContent: "center",
		alignItems: "center",}} onPress={() =>signup(registrationObj)} fullWidthPadding={40}>
	<Text style={styles.buttonText}>CONTINUE</Text>
	</TouchableOpacity> */}
			<Button title="CONTINUE" onPress={validate} fullWidthPadding={40} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	...Styles,
	screenContainer: {
		alignItems: "center",
		paddingHorizontal: 40,
		marginBottom: windowHeight * 0.05,
	},
	title: {
		...Styles.boldFont,
		color: Colors.darkGreen,
		fontSize: 22,
	},
	checkBoxText: {
		...Styles.mediumFont,
		fontSize: 16,
	},
	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
