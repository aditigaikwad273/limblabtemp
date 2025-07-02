import React, { useState, useEffect, useRef } from "react"
import {
	View,
	Text,
	TextInput,
	Image,
	FlatList,
	StyleSheet,
	Animated,
	TouchableOpacity,
	TouchableHighlight,
} from "react-native"
import { WebView } from "react-native-webview"
import { Styles, Colors, Images } from "../theme/Index"

export default function WebViewScreen({ navigation, route }) {
	const url = route.params.params
	return (
		<WebView
			style={styles.webContainer}
			source={{ uri: url }}
			allowsFullscreenVideo={false}
			mediaPlaybackRequiresUserAction={true}
			allowsInlineMediaPlayback={false}
		></WebView>
	)
}

const styles = StyleSheet.create({
	...Styles,
	webContainer: {
		flexGrow: 1,
	},
})
