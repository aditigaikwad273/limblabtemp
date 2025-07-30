import React, { useEffect, useState, useContext, Fragment, useRef } from "react"
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	Platform,
	PermissionsAndroid,
	ScrollView,
	ActivityIndicator,
	Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { Card } from "react-native-elements"
import { RFValue } from "react-native-responsive-fontsize"
import { AuthContext } from "../utils/authContext"
import { ListItem, Icon } from "react-native-elements"
import createAxiosInstance from "../utils/API"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"
import PushNotification from "react-native-push-notification"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
import { Client as ConversationsClient } from "@twilio/conversations"
import useAppStateAwareFocusEffect from "react-navigation-app-state-aware-focus-effect"
import moment from "moment"
import { set } from "react-native-reanimated"

export default ClinicianHomeScreen = (props) => {
	const { user, mainUser, setMainUser, logout, setSelectedClient } = useContext(AuthContext)
	const userFirstName = user.data.first_name
	const userLastName = user.data.last_name
	const userTitle = user.data.title
	const [userLocation, setUserLocation] = useState("")
	const userCode = user.data.api_token
	const userToken = user.data.twilio_token
	const [clientList, setClientList] = useState([])
	const [sortedClientList, setSortedClientList] = useState([])
	const [conversations, setConversations] = useState([])
	const [newList, setNewList] = useState([])
	const userRole = user.data.role
	const navigation = useNavigation()
	const conversationsClient = useRef()
	useAppStateAwareFocusEffect(
		React.useCallback(() => {
			let active = true

			;(async () => {
				try {
					const api = createAxiosInstance(userCode)

					const locationData = await api.get("/api/v1/clinician/practices")

					if (locationData.data?.length > 0) {
						let primaryLocation = locationData.data.find((d) => d.primary)
						if (!primaryLocation) primaryLocation = locationData.data[0]
						setUserLocation(`${primaryLocation.city}, ${primaryLocation.state}`)
					}

					const data = await api.get("/api/v1/clinician/relationships")

					if (active && data) {
						setClientList(data.data)
					}
				} catch (e) {
					console.log("this is an error", e)
				}
			})()

			return () => {
				active = false
			}
		}, [])
	)

	useEffect(() => {
		const fetchData = async () => {
			if (conversations.length === 0) return
			let clientObj = []
			let total = 0
			setNewList([])

			for (let i = 0; i < conversations.length; i++) {
				const item = conversations[i]

				try {
					const withUnRead = await item.getUnreadMessagesCount()
					total += withUnRead
					clientObj.push({
						...item,
						unRead: withUnRead,
					})
				} catch (error) {
					// Handle errors if item.getUnreadMessagesCount() fails
					console.error(`Error fetching data for conversation ${item.id}:`, error)
				}
			}

			PushNotification.setApplicationIconBadgeNumber(total)
			setNewList(clientObj)
		}

		fetchData()
	}, [conversations])
	useEffect(() => {
		if (!conversationsClient.current) return
		conversationsClient.current.on("conversationUpdated", async ({ conversation, updateReasons }) => {
			let clientObj = []
			let total = 0
			for (let i = 0; i < conversations.length; i++) {
				const item = conversations[i]
				const withUnRead = await item.getUnreadMessagesCount()
				total += withUnRead

				clientObj.push({
					...item,
					unRead: withUnRead,
				})
			}

			PushNotification.setApplicationIconBadgeNumber(total)

			setNewList(clientObj)
		})
	}, [conversationsClient.current])
	useAppStateAwareFocusEffect(
		React.useCallback(() => {
			let active = true
			;(async () => {
				try {
					conversationsClient.current = await ConversationsClient.create(userToken)
					// conversationsClient.conversations('CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX').remove();
					const conversationList = await conversationsClient.current.getSubscribedConversations()

					if (active) {
						setConversations(conversationList.items || [])
					}
				} catch (e) {
					console.log("this is an error", e)
				}
			})()

			return () => {
				active = false
			}
		}, [])
	)

	useEffect(() => {
		if (newList.length > 0) {
			const sorted = clientList.slice().sort((a, b) => {
				const getDate = (item) => moment(item?._internalState?.lastMessage?.dateCreated || "")
				const dateA = getDate(newList.find((item) => item._internalState?.uniqueName === a.email))
				const dateB = getDate(newList.find((item) => item._internalState?.uniqueName === b.email))

				return dateB.isValid() - dateA.isValid() || dateB.diff(dateA)
			})

			const updatedSorted = sorted.map((client) => {
				const matchingNewList = newList.find((item) => item._internalState?.uniqueName === client.email)
				return { ...client, unRead: matchingNewList?.unRead || 0 }
			})

			console.log(updatedSorted)

			setSortedClientList(updatedSorted)
		}
	}, [newList])

	useEffect(() => {
		PushNotification.configure({
			// (optional) Called when Token is generated (iOS and Android)
			onRegister: function (registration) {
				const api = createAxiosInstance(userCode)
				api.post(`/api/v1/${userRole}/devices`, {
					device: {
						token: registration.token,
					},
				})
			},
			// (required) Called when a remote is received or opened, or local notification is opened
			onNotification: function (notification) {
				// process the notification
				// (required) Called when a remote is received or opened, or local notification is opened
				notification.finish(PushNotificationIOS.FetchResult.NoData)
			},
			onAction: function (notification) {
				// process the action
			},
			onRegistrationError: function (err) {
				console.error(err.message, err)
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		})
		if (Platform.OS === "android") PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
	}, [])

	const getClientConvo = (info) => {
		// setSelectedClient(info)
		// navigateMessage(user.data.api_token)
		// return
		const api = createAxiosInstance(user.data.api_token)
		api
			.post("/api/v1/clinician/conversations", {
				conversation: {
					client_id: info.client_id,
				},
			})
			.then((response) => {
				setSelectedClient(info)
				navigateMessage(response.data.api_token)
			})
			.catch((error) => {
				console.error("error", error)
			})
	}

	const List = sortedClientList.map((client) => {
		return (
			<View
				key={client.email}
				style={{ width: windowWidth, marginLeft: windowWidth * 0.04, textAlign: "left", backgroundColor: "#F3F3F3" }}
			>
				<TouchableOpacity key={client.email} onPress={() => getClientConvo(client, client)}>
					<ListItem bottomDivider containerStyle={{ backgroundColor: "#F3F3F3" }}>
						<ListItem.Content>
							<View style={{ flexDirection: "row", justifyContent: "space-between", textAlign: "center" }}>
								<ListItem.Title style={{ ...Styles.boldFont, fontSize: 21 }}>
									{client.first_name} {client.last_name}
								</ListItem.Title>
							</View>
							<ListItem.Title style={{ fontSize: 21 }}>{userLocation}</ListItem.Title>
						</ListItem.Content>
						<ListItem.Title style={{ fontSize: 21 }}>{client.unRead}</ListItem.Title>
						<ListItem.Chevron size={26} />
					</ListItem>
				</TouchableOpacity>
			</View>
		)
	})

	const navigateMessage = (sid) => {
		navigation.navigate("ClinicianMessageScreen", { sid: sid })
	}

	const navigateSettings = () => {
		navigation.navigate("ClinicianSettings")
	}

	return (
		<Fragment>
			<SafeAreaView style={{ backgroundColor: "white" }} />
			<View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
				<Image source={Images.logoBig} style={{ width: windowWidth * 0.8 }} />
				<Text style={{ color: Colors.olive, marginTop: 10 }}>CLINICIAN PORTAL</Text>
				<View
					style={{
						alignItems: "center",
						height: windowHeight * 0.1,
						marginTop: windowHeight * 0.02,
						width: windowWidth,
						marginBottom: 50,
						backgroundColor: "white",
					}}
				>
					<TouchableOpacity onPress={navigateSettings}>
						<Card
							containerStyle={{
								width: windowWidth,
								paddingLeft: 20,
								margin: 0,
								borderWidth: 0,
								backgroundColor: "white",
								paddingTop: 30,
								paddingBottom: 30,
								shadowColor: "rgba(0,0,0, .2)",
								shadowOffset: { height: 0, width: 0 },
								shadowOpacity: 1,
								shadowRadius: 1,
							}}
						>
							<Text style={styles.title}>
								{userFirstName} {userLastName}
							</Text>
							<Text style={styles.title1}>{userTitle} </Text>
							<Text style={styles.title1}>{userLocation}</Text>
						</Card>
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView contentContainerStyle={{ backgroundColor: "#F3F3F3", marginBottom: 50 }}>
				<Text style={{ margin: 20, ...Styles.sfSemiBoldFont, fontSize: 24 }}>Clients</Text>

				{sortedClientList.length === 0 && (
					<ActivityIndicator style={{ marginTop: 100, alignItems: "center" }} size="large" color="#576C64" />
				)}
				{List}
			</ScrollView>
		</Fragment>
	)
}

const styles = StyleSheet.create({
	...Styles,
	screenContainer: {
		paddingLeft: 20,
		// paddingHorizontal: 40,
		marginBottom: windowHeight * 0.05,
	},
	title: {
		...Styles.boldFont,
		fontSize: 24,
		marginBottom: 8,
	},
	title1: {
		...Styles.mediumFont,
		fontSize: 18,
		marginBottom: 8,
	},
	title2: {
		...Styles.boldFont,
		fontSize: 18,
		flex: 1,
		justifyContent: "space-between",
	},
	checkBoxText: {
		...Styles.mediumFont,
		fontSize: 16,
	},
	buttonText: {
		...Styles.boldFont,
		color: Colors.olive,
		fontSize: RFValue(18),
		textAlign: "center",
	},
	bottomView: {
		width: "100%",
		height: 80,
		backgroundColor: "#323232",
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute", //Here is the trick
		bottom: 0, //Here is the trick
		padding: 30,
	},
	bottomView1: {
		width: "100%",
		height: 80,
		position: "absolute", //Here is the trick
		bottom: 200, //Here is the trick
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		borderColor: Colors.olive,
		borderWidth: 2,
		borderRadius: 40,
		padding: 10,
		paddingHorizontal: 30,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		width: windowWidth * 0.7,
	},
})
