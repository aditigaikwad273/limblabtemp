import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"

export default SplashScreen = (props) => {
	return (
		<View style={styles.mainContainer}>
			<Text>Splash</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	...Styles,
})
