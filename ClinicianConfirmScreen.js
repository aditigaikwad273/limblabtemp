import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, Dimensions,TouchableWithoutFeedback, Keyboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Button, Input } from "../componenets/Index"
import { RFValue } from "react-native-responsive-fontsize"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ClinicianConfirmScreen = (props) => {
	const [pass, setPass] = useState("")
	const [email, setEmail] = React.useState("")

	const validate = () => {
		// validate form values

		// AuthStore.addRegistrationValues({ clinicianCode })
		props.navigation.navigate("ClinicianHomeScreen")
	}

	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<SafeAreaView style={styles.screenContainer}>	
		<Input title="Your Email" onChangeText={setEmail} />
		<Input title="Your Assigned Password" onChangeText={setPass} style ={{marginBottom:30}}/>
		<Text style={{width: windowWidth * .4, textAlign:'center'}}>You can change this later in your settings</Text>
		<View style={{marginTop: windowHeight * .05, alignItems: "center",}}>
		<Button title="CONTINUE" onPress={validate} fullWidthPadding={40}/>
		<Text style={styles.noCode}>Don't have a Password?</Text>
		<Text style={styles.call}>Call 123-456-7890 to get setup</Text>
		</View>
	</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	...Styles,
	screenContainer: {
		flex: 1,
		backgroundColor: Colors.white,
		alignItems: "center",
		paddingHorizontal: 40,
	},
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
	noCode: {
		...Styles.boldFont,
		fontSize: 20,
		marginBottom: windowHeight * .01,
		marginTop:windowHeight * .05
	},
	call:{
		...Styles.mediumFont,
		fontSize: 18,
	}
})
