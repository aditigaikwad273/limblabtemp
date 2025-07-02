import React, { useEffect, useState, useContext } from "react"
import { View, StyleSheet, Dimensions, Alert, TouchableWithoutFeedback, Keyboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { RFValue } from "react-native-responsive-fontsize"
import { Button, Input } from "../componenets/Index"

import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const RegisterName = (props) => {
	const [first_name, setFirstName] = React.useState("")
	const [last_name, setLastName] = React.useState("")
	const { addRegistrationValues, registrationObj } = useContext(AuthContext)
	const navigation = useNavigation()
	const validate = (props) => {
		// validate form values
		if (first_name.length === 0 || last_name.length === 0) {
			Alert.alert("Limb Lab", "please enter First Name and Last Name")
		} else {
			addRegistrationValues({ first_name, last_name })
			navigation.navigate("RegisterContact", {
				first_name: first_name,
				last_name: last_name,
			})
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.mainContainer}>
				{/* <View style={styles.screenContainer}> */}

				<Input title="First Name" onChangeText={setFirstName} style={{ marginBottom: 30 }} />

				<Input title="Last Name" onChangeText={setLastName} />
				<View style={{ marginTop: windowHeight * 0.05 }}>
					{/* <Button title="CONTINUE" onPress={() => {addRegistrationValues(firstName, lastName), navigation.navigate("RegisterContact")}} fullWidthPadding={40}/> */}
					<Button title="CONTINUE" onPress={validate} fullWidthPadding={40} />
				</View>
				{/* </View> */}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

export default RegisterName

const styles = StyleSheet.create({
	...Styles,
	title: {
		...Styles.boldFont,
		fontSize: RFValue(24),
		textAlign: "center",
		marginTop: 100,
	},
	input: {
		borderColor: Colors.grey,
		borderWidth: 1,
		width: "100%",
		height: 50,
		marginBottom: 100,
	},
	// screenContainer: {
	// 	flex: 1,
	// 	justifyContent: "space-evenly",
	// 	alignItems: "center",

	// },
})
