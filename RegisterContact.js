import React, { useEffect, useState, useContext } from "react"
import { View, StyleSheet, Text, Dimensions, Alert, TouchableWithoutFeedback, Keyboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { RFValue } from "react-native-responsive-fontsize"
import { Button, Input } from "../componenets/Index"

import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const RegisterContact = (props) => {
	const [email, setEmail] = React.useState("")
	const [phone, setPhone] = React.useState("")
	const { addRegistrationValues, registrationObj } = useContext(AuthContext)
	const navigation = useNavigation()

	const validate = (props) => {
		// validate form values
		addRegistrationValues({ email, phone })
		const ValidatePhone = (number) => {
			var validRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
			const phone = number && number.toString().replace(/\D/g, "")
			return phone && phone.length === 7
				? phone.match(validRegex)
				: phone && phone.length === 10
				? phone.match(validRegex)
				: false
		}

		const ValidateEmail = (email) => {
			var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

			if (email.match(validRegex) && email.length > 0) {
				return true
			} else {
				Alert.alert("Limb Lab", "please enter a valid Email")

				return false
			}
		}
		if (ValidatePhone(phone) && ValidateEmail(email)) {
			addRegistrationValues({ email, phone })
			navigation.navigate("RegisterPassword", {
				email: email,
				phone: phone,
			})
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
				<Input title="Email Address" onChangeText={setEmail} />
				<Input title="Phone" onChangeText={setPhone} />
				<View style={{ alignItems: "center" }}>
					<Text styles={Styles.mediumFont}>Your phone number will only be used </Text>
					<Text styles={Styles.mediumFont}>to contact you at your request.</Text>
				</View>
				<View style={{ marginTop: windowHeight * 0.05 }}>
					<Button title="CONTINUE" onPress={validate} fullWidthPadding={40} />
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

export default RegisterContact

const styles = StyleSheet.create({
	...Styles,
	title: {
		...Styles.boldFont,
		fontSize: RFValue(24),
		textAlign: "center",
	},
	input: {
		borderColor: Colors.grey,
		borderWidth: 1,
		width: "100%",
		height: 50,
	},
})
