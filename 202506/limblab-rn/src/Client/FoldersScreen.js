import React, { useState, useEffect } from "react"
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native"
import { ListItem, Icon } from "react-native-elements"
const windowWidth = Dimensions.get("window").width
import { Styles } from "../theme/Index"

const FoldersScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [projects, setProjects] = useState([])

	const filteredFolders = [
		"138e04ed8ba8b5c495c937645366de731b54f144",
		"2685401321c358ebaeacb8cb8162812355f3a19c",
		"0e49c7035f372c817efecd74550ab0b7697fe412",
		"4a70eb5398a25e80f097d48277b151b92073d2c1",
	]

	useEffect(() => {
		fetchProjects()
	}, [])

	const fetchProjects = async () => {
		try {
			const response = await fetch("https://api.vimeo.com/users/212510206/projects", {
				headers: {
					Authorization: "Bearer f91cb94fdeeedc139fdeda0193a0c3db",
				},
			})

			const json = await response.json()
			setProjects(json.data.filter((d) => !filteredFolders.includes(d.resource_key)))
			setIsLoading(false)
		} catch (error) {
			console.error("Error fetching projects:", error)
			setIsLoading(false)
		}
	}

	const renderProjectItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("VideosScreen", { folder: item })
			}}
			style={{ width: windowWidth, marginLeft: windowWidth * 0.03, textAlign: "left" }}
		>
			<ListItem key={item.resource_key} bottomDivider>
				<ListItem.Content>
					<ListItem.Title style={{ ...Styles.boldFont, paddingLeft: 0 }}>{item.name}</ListItem.Title>
				</ListItem.Content>
				<Icon size={26} name="chevron-right" type="feather" color={'gray'} />
			</ListItem>
		</TouchableOpacity>
	)

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

export default FoldersScreen
