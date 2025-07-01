import React, { useState } from "react"
import { StyleSheet, Text, TextInput, Dimensions, View, Platform } from "react-native"
import { Styles, Colors } from "../theme/Index"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default Input = (props) => {
	return (
		<View style={{ alignItems: "center" }}>
			<Text style={styles.title}>{props.title}</Text>
			<TextInput
				paddingLeft={5}
				style={styles.input}
				onChangeText={props.onChangeText}
				value={props.value}
				autoComplete={"off"}
				autoCorrect={false}
				keyboardType={Platform.OS == "ios" ? "default" : "visible-password"}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	...Styles,
	title: {
		...Styles.boldFont,
		fontSize: 24,
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
	},
})
