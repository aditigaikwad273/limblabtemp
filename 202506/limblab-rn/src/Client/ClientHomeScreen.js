import React, { useState, useEffect, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Pressable,
	Dimensions,
	Linking,
	Platform,
	TouchableOpacity,
	ScrollView,
	Image,
	Alert,
	PermissionsAndroid,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import Button from "../componenets/Button"
import { Card } from "react-native-elements"
import { RFValue } from "react-native-responsive-fontsize"
import { createOpenLink } from "react-native-open-maps"
import { AuthContext } from "../utils/authContext"
import { useNavigation } from "@react-navigation/native"
import useAppStateAwareFocusEffect from "react-navigation-app-state-aware-focus-effect"
import Modal from "react-native-modal"
import createAxiosInstance from "../utils/API"
import { Client as ConversationsClient } from "@twilio/conversations"
import PushNotification from "react-native-push-notification"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import analytics from "@react-native-firebase/analytics"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
//import NotificationService from '../utils/NotificationService';
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default ClientHomeScreen = (props) => {
	const { user, mainUser, setMainUser, registrationObj, clinicianCode } = useContext(AuthContext)
	const [modalVisible, setModalVisible] = useState(false)
	const [info, setInfo] = useState()
	const [officeInfo, setOfficeInfo] = useState()
	const [connection, setConnection] = useState()
	const userName = user.data.first_name
	const userCode = user.data.api_token
	const userToken = user.data.twilio_token
	const officeLocation = officeInfo?.officeLocation
	const officeAddress = officeInfo?.officeAddress
	const officeNumberIOS = officeInfo?.officeNumberIOS
	const officeNumber = officeInfo?.officeNumber
	const officeImage = officeInfo?.officeImage
	const openOffice = createOpenLink({ navigate_mode: "navigate", end: [officeAddress] })
	const navigation = useNavigation()
	const [newList, setNewList] = useState(0)
	const [conversations, setConversations] = useState([])
	const [clinician, setClinician] = useState()
	const [noClinician, setNoClinician] = useState(false)
	const userRole = user.data.role

	useEffect(() => {
		messageCount()
	}, [conversations])
	const messageCount = async () => {
		let total = 0

		for (let i = 0; i < conversations.length; i++) {
			let item = conversations[i]
			if (item?._internalState?.uniqueName == user.data.email) {
				total += await item.getUnreadMessagesCount()
			}
		}
		// PushNotification.setApplicationIconBadgeNumber(total)
		setNewList(total)
	}
	useAppStateAwareFocusEffect(
		React.useCallback(() => {
			let active = true
			; (async () => {
				try {
					const conversationsClient = new ConversationsClient(userToken)
					const conversationList = await conversationsClient.getSubscribedConversations()
					conversationsClient.on("conversationUpdated", async ({ conversation, updateReasons }) => {
						/*let firstUpdateReason = ''
						if (updateReasons.length > 0) {
							firstUpdateReason = updateReasons[0]
						}*/
						let total = 0
						if (conversation?._internalState?.uniqueName == user.data.email) {
							try {
								const unReadCount = await conversation.getUnreadMessagesCount()
								total += unReadCount
							} catch (error) {
								console.log("Error getting messages count:", error)
							}							
						}
						/*if (firstUpdateReason !== 'lastReadMessageIndex') {
							const latestMessagr = await conversation?.getMessages(1)
							const authorParticipant = await latestMessagr.items[0].getParticipant()
							if (authorParticipant.identity !== user.data.email) {
								const n = new NotificationService()
								n.badgeCountUpdateOnlyNotif("You have a new LimbLab message waiting for you")
								PushNotification.setApplicationIconBadgeNumber(total)	
							}
						}*/
						setNewList(total)
						// setConversations(conversation.getUnreadMessagesCount() || [])

						// Fired when the attributes or the metadata of a conversation have been updated
					})
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

	const bigFunction = async () => {
		const api = createAxiosInstance(userCode)
		if (registrationObj && registrationObj.clinicianCode) {
			const connection = await api
				.post("/api/v1/client/relationships/", { clinician: { code: `${registrationObj.clinicianCode}` } })
				.then((data) => {
					if (data) {
						setConnection(data)
						return data
					} else {
						setNoClinician(true)
					}
				})
				.catch((error) => {
					setNoClinician(true)
					Alert.alert("Limb Lab: ", error.response.data.errors.code)
					console.log("this is an error24", error.response.data)
				})
			if (connection) {
				await api
					.get("/api/v1/client/relationships")
					.then((data) => {
						// console.log('data', data.data[0].practices)
						if (data) {
							setInfo(data.data)
							return data
						} else {
							setInfo(data.data)
						}
					})
					.catch((error) => {
						console.log("this is an error", error.response.data)
					})
				if (info) {
					const practice = info.map((doc) => doc.practices.find((location) => location.primary === true))
					const primaryLocation = practice[0]

					if (primaryLocation) {
						return setOfficeInfo({
							officeLocation: `${primaryLocation.city} ${primaryLocation.state}`,
							officeAddress: `${primaryLocation.address_line1} ${primaryLocation.address_line2} ${primaryLocation.city} ${primaryLocation.state} ${primaryLocation.postal}`,
							officeNumberIOS: `telprompt:${primaryLocation.phone}`,
							officeNumber: `tel:${primaryLocation.phone}`,
						})
					}
				}
			}
		} else {
			const relationship = await api.get("/api/v1/client/relationships")
			// )
			// .then((data) => {
			// 	if (data.data.length < 1) {
			// 		setNoClinician(true)
			// 		console.log("NO CLINICIAN", noClinician)
			// 	} else {
			// 		setClinician(data.data)
			// 		setNoClinician(false)
			// 		return data
			// 	}
			// })
			// .catch((error) => {
			// 	console.log("this is an error", error)
			// })
			if (relationship.length < 1) {
				setNoClinician(true)
			} else {
				setClinician(relationship.data)
				setNoClinician(false)
			}
			if (relationship && clinician) {
				const practice = clinician.map((doc) => doc.practices.find((location) => location.primary === true))

				const primaryLocation = practice[0]
				if (primaryLocation) {
					if (primaryLocation.length > 1) {
						setNoClinician(false)
					}
					return setOfficeInfo({
						officeLocation: `${primaryLocation.name}`,
						officeAddress: `${primaryLocation.address_line1} ${primaryLocation.address_line2} ${primaryLocation.city} ${primaryLocation.state} ${primaryLocation.postal}`,
						officeNumberIOS: `telprompt:${primaryLocation.phone}`,
						officeNumber: `tel:${primaryLocation.phone}`,
						officeImage: `${primaryLocation.hero_image}`,
					})
				}
			}
		}
	}

	useEffect(() => {
		if (!officeInfo) {
			bigFunction()
		} else {
			return
		}
	}, [bigFunction, officeInfo, clinician, noClinician, user])

	// useEffect(async () => {
	// 	console.log('what is this', `${officeImage}`)
	// 	await axios.get(`${officeImage}`).then((response) => {
	// 		console.log('what is this right here for the home image', )
	// 	  setClinicianImage({uri: response.status === 200 ? response.url : null});
	// 	});
	// }, [officeImage, clinician, clinicianImage])

	const makeCall = () => {
		if ((!officeNumber && Platform.OS === "android") || (!officeNumberIOS && Platform.OS === "ios")) {
			Alert.alert("No office number available")
			return
		}
		let phoneNumber = ""

		if (Platform.OS === "android") {
			phoneNumber = officeNumber
		} else {
			phoneNumber = officeNumberIOS
		}

		Linking.openURL(phoneNumber)
	}

	const navigateMessage = async () => {
		// validate form values
		navigation.navigate("MessageScreen")
		await analytics().logEvent("menu_messages")
	}
	const navigateResources = () => {
		// validate form values
		navigation.navigate("ResourcesScreen")
		analytics().logEvent("menu_resources")
	}
	const navigateSettings = () => {
		// validate form values
		navigation.navigate("SettingsScreen")
		analytics().logEvent("menu_settings")
	}

	const navigateHome = () => {
		// validate form values
		navigation.navigate("ClientHomeScreen")
		analytics().logEvent("menu_home")
	}

	return (
		<SafeAreaView style={styles.homeContainer}>
			<ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: Platform.OS == 'ios' ? 50 : 0 }}>
				<Text style={{ ...Styles.sfBoldFont, fontSize: 34, marginLeft: windowWidth * 0.03 }}> Hello {userName}!</Text>
				{!noClinician ? (
					<Card containerStyle={{ borderRadius: 20, width: windowWidth * 0.93, alignItems: "center" }}>
						<View style={{ flexDirection: "row", alignContent: "flex-start", marginLeft: windowWidth * 0.1 }}>
							<Image source={Images.icnMessages} style={{ marginTop: 12 }} />
							<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, paddingLeft: 30, marginTop: 15 }}>
								You Have{" "}
							</Text>
						</View>
						<View style={styles.screenContainer}>
							<Text
								style={{
									...Styles.boldFont,
									marginBottom: 10,
									fontSize: 18,
									color: Colors.olive,
									marginRight: windowWidth * 0.08,
								}}
							>
								{newList}
								<Text style={{ ...Styles.boldFont, color: "black" }}> New Messages</Text>
							</Text>
							<Button
								title="Go To Messages"
								fullWidthPadding={40}
								onPress={() => props.navigation.navigate("MessageScreen")}
							/>
						</View>
					</Card>
				) : (
					<Card containerStyle={{ borderRadius: 20, width: windowWidth * 0.93, alignItems: "center" }}>
						<View style={{ flexDirection: "row", alignContent: "flex-start", marginLeft: windowWidth * 0.1 }}>
							<Image source={Images.icnMessages} style={{ marginTop: 12 }} />
							<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, paddingLeft: 10, marginTop: 15 }}>
								Connect to a clinician
							</Text>
						</View>
						<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, textAlign: "center" }}>
							to enable messaging
						</Text>
						<View style={styles.screenContainer}>
							<Button
								title="GET CONNECTED"
								fullWidthPadding={40}
								onPress={() => props.navigation.navigate("ClinicianCode")}
							/>
						</View>
					</Card>
				)}
				<Card containerStyle={{ borderRadius: 20, width: windowWidth * 0.93, alignItems: "center" }}>
					<View style={styles.screenContainer}>
						<Image source={Images.logoBig} resizeMode="contain" style={{ marginTop: 12, width: "70%" }} />
						<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, paddingLeft: 10, marginTop: 15 }}>
							We are here for you.
						</Text>
						<Button
							title="VIDEO RESOURCES"
							fullWidthPadding={40}
							onPress={() => props.navigation.navigate("FoldersScreen")}
						/>
					</View>
				</Card>
				<View>
					{!noClinician ? (
						<Card containerStyle={{ padding: -15, width: windowWidth * 0.93, borderRadius: 20 }}>
							<Image
								source={{ uri: `${officeImage}` }}
								style={{ width: windowWidth * 0.93, borderRadius: 20, height: 200 }}
							/>
							<View style={{ paddingVertical: 15 }}>
								<View style={{ paddingHorizontal: 15 }} >
								<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, color: Colors.olive }}>
									YOUR OFFICE
								</Text>
								<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 28, marginBottom: 20 }}>
									{officeLocation}
								</Text>
								</View>
								<View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 6 }}>
									<Pressable style={styles.button1} onPress={openOffice}>
										<Text style={styles.buttonText1}>MAP</Text>
									</Pressable>
									<Pressable style={styles.button} onPress={makeCall}>
										<Text style={styles.buttonText}>CALL</Text>
									</Pressable>
								</View>
							</View>
						</Card>
					) : (
						<Card containerStyle={{ padding: -15, width: windowWidth * 0.93, borderRadius: 20 }}>
							<Image source={Images.office} style={{ width: windowWidth * 0.93, borderRadius: 20 }} />
							<View style={{ padding: 15, justifyContent: "center" }}>
								<Text style={{ ...Styles.boldFont, marginBottom: 10, fontSize: 18, textAlign: "center" }}>
									We are here for you.
								</Text>
								<View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
									<Button title="View Resources" fullWidthPadding={40} onPress={navigateResources} />
								</View>
							</View>
						</Card>
					)}
				</View>
			</ScrollView>
			<View style={styles.bottomView}>
				<Image source={Images.logoWhite} style={{ width: 200 }} />
				<TouchableOpacity
					style={{ backgroundColor: "#323232", width: 50, height: 100 }}
					onPress={async () => {
						setModalVisible(true)
						analytics().logEvent("menu")
					}}
				>
					<Icon name="menu" size={35} color="#fff" />
				</TouchableOpacity>
			</View>
			<Modal
				style={{ margin: 0 }}
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.")
					setModalVisible(!modalVisible)
				}}
			>
				<View style={{ backgroundColor: "#323232", alignItems: "center", width: windowWidth, height: windowHeight }}>
					<View style={{ marginTop: windowHeight * 0.1, alignItems: "center" }}>
						<TouchableOpacity
							style={{
								borderColor: "white",
								borderWidth: 1,
								padding: 25,
								width: windowWidth * 0.8,
								marginBottom: 20,
								flexDirection: "row",
							}}
							onPress={() => {
								setModalVisible(!modalVisible), navigateHome()
							}}
						>
							<Image source={Images.icnMenuHome} />
							<Text style={{ color: "white", marginLeft: 20, padding: 20 }}>Home</Text>
							{/* <FontAwesomeIcon size={24} icon ={faTimes} /> */}
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderColor: "white",
								borderWidth: 1,
								padding: 25,
								width: windowWidth * 0.8,
								marginBottom: 20,
								flexDirection: "row",
							}}
							onPress={() => {
								setModalVisible(!modalVisible), navigateResources()
							}}
						>
							<Image source={Images.icnMenuResources} />
							<Text style={{ color: "white", marginLeft: 20, padding: 20 }}>Resources</Text>
							{/* <FontAwesomeIcon size={24} icon ={faTimes} /> */}
						</TouchableOpacity>
						<TouchableOpacity
							disabled={noClinician}
							style={{
								borderColor: "white",
								borderWidth: 1,
								padding: 25,
								width: windowWidth * 0.8,
								marginBottom: 5,
								flexDirection: "row",
							}}
							onPress={() => {
								setModalVisible(!modalVisible), navigateMessage()
							}}
						>
							<Image source={Images.icnMenuChat} />
							<Text style={{ color: "white", marginLeft: 20, padding: 20 }}>Messages</Text>
							{/* <FontAwesomeIcon size={24} icon ={faTimes} /> */}
						</TouchableOpacity>
						<TouchableOpacity
							style={{ padding: 25, marginBottom: 20, flexDirection: "row" }}
							onPress={() => {
								setModalVisible(!modalVisible), navigateSettings()
							}}
						>
							<Image source={Images.icnMenuSettings} />
							<Text style={{ color: "white", marginLeft: windowWidth * 0.1, marginTop: 3 }}>Settings</Text>
							{/* <FontAwesomeIcon size={24} icon ={faTimes} /> */}
						</TouchableOpacity>
						<View style={styles.modalView}>
							<Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}></Pressable>
						</View>
					</View>
				</View>
				<View style={styles.bottomView}>
					<Image source={Images.logoWhite} style={{ width: 200 }} />
					<TouchableOpacity style={{ backgroundColor: "#323232" }} onPress={() => setModalVisible(false)}>
						<Icon name="menu" size={35} color="#fff" />
					</TouchableOpacity>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	...Styles,

	screenContainer: {
		alignItems: "center",
		// paddingHorizontal: 40,
	},
	button: {
		backgroundColor: Colors.darkGreen,
		borderRadius: 40,
		padding: 10,
		paddingHorizontal: 60,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 15,
	},
	button1: {
		backgroundColor: Colors.white,
		borderRadius: 40,
		padding: 10,
		paddingHorizontal: 60,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: Colors.darkGreen,
	},
	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
	buttonText1: {
		...Styles.boldFont,
		color: Colors.darkGreen,
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
		padding: 20,
	},
})