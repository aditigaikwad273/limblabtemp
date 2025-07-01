import React, { useRef, useState } from "react"
import { Pressable, Platform } from "react-native"
import Video from "react-native-video"

const VideoPlayer = ({ url, style, disabled }) => {
	const player = useRef()
	const [pause, setPause] = useState(true)
	return (
		<Pressable onPress={() => player.current.presentFullscreenPlayer()} disabled={disabled}>
			<Video
				source={{ uri: url }} // Can be a URL or a local file.
				ref={player} // Store reference
				onFullscreenPlayerDidPresent={() => {
					setPause(false)
				}}
				onVideoFullscreenPlayerDidDismiss={() => {
					setPause(true)
				}}
				// onBuffer={this.onBuffer}                // Callback when remote video is buffering
				// onError={this.videoError}               // Callback when video cannot be loaded
				disableFocus={false}
				controls={Platform.OS === "android"}
				paused={pause}
				playWhenInactive={false}
				style={style}
			/>
		</Pressable>
	)
}

export default VideoPlayer
