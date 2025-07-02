import React, { useState, useEffect } from "react"
import { View, Image, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native"
import { ListItem } from "react-native-elements"
const windowWidth = Dimensions.get("window").width
import { Styles } from "../theme/Index"

const VideosScreen = ({ navigation, route }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [projects, setProjects] = useState([])

	useEffect(() => {
		fetchProjects()
	}, [])

	const fetchProjects = async () => {
		const { folder } = route.params
		try {
			const response = await fetch(`https://api.vimeo.com/${folder.uri}/videos`, {
				headers: {
					Authorization: "Bearer f91cb94fdeeedc139fdeda0193a0c3db",
				},
			})

			const json = await response.json()
			setProjects(json.data)
			setIsLoading(false)
		} catch (error) {
			console.error("Error fetching projects:", error)
			setIsLoading(false)
		}
	}

	const renderProjectItem = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("VideoDetailsScreen", { video: item })}
				style={{ width: windowWidth, paddingHorizontal: windowWidth * 0.03, textAlign: "left" }}
			>
				<ListItem key={item.resource_key} bottomDivider>
					<ListItem.Content>
						<Image src={item.pictures.base_link} style={{ width: "100%", height: 250 }} resizeMode="contain" />
						<ListItem.Title style={{ ...Styles.boldFont, textAlign: "left", paddingTop: 10 }}>
							{item.name}
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</TouchableOpacity>
		)
	}

	return (
		<View style={{ flex: 1 }}>
			{isLoading ? (
				<ActivityIndicator size="large" color="#323232" />
			) : (
				<FlatList
					data={projects}
					style={{ backgroundColor: "white" }}
					renderItem={renderProjectItem}
					keyExtractor={(item) => item.uri}
				/>
			)}
		</View>
	)
}

export default VideosScreen
