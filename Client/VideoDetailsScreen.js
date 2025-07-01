import React from "react"
import { View, Text } from "react-native"
import { WebView } from "react-native-webview"
import { Styles } from "../theme/Index"

const VideoDetailsScreen = ({ route }) => {
	const { video } = route.params

	console.log(video.player_embed_url)
	return (
		<View style={{ flex: 1 }}>
			<View style={{ padding: 20 }}>
				<Text style={{ ...Styles.boldFont, fontSize: 16 }}>{video.name}</Text>
			</View>
			<View style={{ flex: 1 }}>
				<WebView source={{ uri: video.player_embed_url }} />
			</View>
		</View>
	)
}

export default VideoDetailsScreen
