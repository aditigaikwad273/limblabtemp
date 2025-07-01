import React, { useEffect, useState, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	Linking,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Card } from "react-native-elements"
import { ListItem, Icon } from "react-native-elements"
import { AuthContext } from "../utils/authContext"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default ClientNotesScreen = (props) => {
	const { user, mainUser, setMainUser, logout, selectedClient, setClientNotes } = useContext(AuthContext)
	const first_name = selectedClient?.first_name
	const last_name = selectedClient?.last_name
	const phone = selectedClient?.phone
	const email = selectedClient?.email
	const clientNumberIOS = `telprompt:${phone}`
	const clientNumber = `tel:${phone}`
	const [notes, setNotes] = React.useState(selectedClient?.notes || "")
	const handleEmail = () => {
		Linking.openURL(`mailto:${selectedClient?.email}?subject=SendMail&body=Description`)
	}

	const makeCall = () => {
		let phoneNumber = ""

		if (Platform.OS === "android") {
			phoneNumber = `tel:${phone}`
		} else {
			phoneNumber = `telprompt:${selectedClient.phone}`
		}

		Linking.openURL(phoneNumber)
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView>
				<Card
					containerStyle={{
						width: windowWidth,
						paddingLeft: 20,
						margin: 0,
						borderWidth: 0,
						topBorder: 0,
						backgroundColor: "#F3F3F3",
						paddingTop: 10,
						paddingBottom: 10,
					}}
				>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text style={{ ...Styles.boldFont, fontSize: 21 }}>
							{selectedClient?.first_name} {selectedClient?.last_name}
						</Text>
					</View>
					<TouchableOpacity onPress={makeCall}>
						<Text style={styles.title1}>P: {selectedClient?.phone}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleEmail}>
						<Text style={styles.title1}>E: {selectedClient?.email}</Text>
					</TouchableOpacity>
					<Card.Divider style={{ width: windowWidth }} />
				</Card>
				<TextInput
					placeholderTextColor="#000"
					autoCapitalize="none"
					multiline={true}
					style={styles.inputForm}
					placeholder="Start typing here...."
					onChangeText={(notes) => {
						setNotes(notes)
						setClientNotes(notes)
					}}
					value={notes}
				/>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	...Styles,
	title1: {
		...Styles.mediumFont,
		fontSize: 18,
		marginBottom: 8,
	},
})
