import React from "react"
import { StyleSheet, Text, Pressable, Dimensions, View,  TouchableOpacity} from "react-native"
import { Styles, Colors } from "../theme/Index"
import { RFValue } from "react-native-responsive-fontsize"

const { width } = Dimensions.get("screen")

const Button = (props) => {
	return (
		<View style={props.fullWidthPadding && { width, paddingHorizontal: props.fullWidthPadding }}>
			<TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
				<Text style={styles.buttonText}>{props.title}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default Button

const styles = StyleSheet.create({
	...Styles,
	button: {
		backgroundColor: Colors.darkGreen,
		borderRadius: 40,
		padding: 10,
		paddingHorizontal: 30,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
