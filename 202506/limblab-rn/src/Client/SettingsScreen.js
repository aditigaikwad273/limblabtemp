import React, { useState, useEffect, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Image,
	Pressable,
	Dimensions,
	ScrollView,
	Platform,
	TouchableOpacity,
	Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { ListItem, Switch, Icon as EIcon } from "react-native-elements"
import createAxiosInstance from "../utils/API"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { RFValue } from "react-native-responsive-fontsize"
import Modal from "react-native-modal"
import { Card } from "react-native-elements"
import analytics from "@react-native-firebase/analytics"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
import Mailer from "react-native-mail"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default Settings = (props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const [notificationState, setNotificationState] = useState(false)
	const toggleSwitch = () => setNotificationState((previousState) => !previousState)
	const { user, mainUser, setMainUser, logout } = useContext(AuthContext)
	const navigation = useNavigation()
	const userCode = user.data.api_token
	const userFirstName = user.data.first_name
	const userLastName = user.data.last_name
	const userPhone = user.data.phone
	const userEmail = user.data.email
	const [biometryType, setBiometryType] = useState("")

	const [connected, setConnected] = useState(false)

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

	const list = [
		{
			title: { name: "Notifications" },
			status: "",
			link: "NotificationScreen",
		},
		{
			title: { name: "Clinician Code" },
			status: "Connected",
			link: "ClinicianCode",
		},
		{
			title: { name: "Reset Password" },
			status: "",
			link: "ForgetPassword",
		},
		{
			title: { name: "Biometric Login" },
			status: "",
			switch: true,
			value: false,
		},
		{
			title: { name: "Delete Account" },
			status: "",
			link: () => confirmAlert(),
		},
	]

	const forgetPassword = () => {
		// validate form values
		navigation.navigate("ForgetPassword")
	}

	// useEffect(() => {
	// 	PushNotification.checkPermissions(permissions => {
	// 			// 		if (permissions.alert !== true) {
	// 		  setNotificationState(false);
	// 		} else {
	// 		  setNotificationState(true);
	// 		}
	// 	  });
	// },[notificationState])

	useEffect(() => {
		const api = createAxiosInstance(userCode)
		api
			.get("/api/v1/client/relationships")
			.then((data) => {
				if (!data.data.length) {
					setConnected(false)
				} else {
					setConnected(true)
					return data
				}
			})
			.catch((error) => {})
	}, [connected])

	const [listData, setListData] = useState(list)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem("biometricEnabled")
				console.warn("value", value)
				const type = await AsyncStorage.getItem("BiometryType")
				setBiometryType(type)
				onValueChange(value === "true", 3)
			} catch (error) {
				// Handle errors, if any
				console.error("Error fetching data:", error)
			}
		}

		fetchData()
	}, [])

	const onPressItem = (item) => {
		console.log("TEST")
		if (typeof item.link === "string") {
			navigation.navigate(item.link)
		} else if (item.title.name == "Delete Account") {
			confirmAlert()
		}
	}
	const onValueChange = (value, i) => {
		let newList = [...listData]
		newList[i].value = value
		setListData(newList)
		console.warn(String(value))
		AsyncStorage.setItem("biometricEnabled", String(value))
	}
	const confirmAlert = () => {
		Alert.alert(
			"Are you sure you want to delete your account?",
			"Your information will be removed and you will no longer have access to this app. You will need to create a new account to have access again.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => deleteAccountEnail(),
				},
			]
		)
	}
	const deleteAccountEnail = () => {
		let body = `Requesting account deletion for data attached to ${userEmail}`
		Mailer.mail(
			{
				subject: "Limb Lab Account Deletion Request",
				recipients: ["accountdeletion@limblab.com"],
				body: body,
				isHTML: true,
			},
			(error, event) => {
				console.warn(error)
				console.warn(event)
				if (event == "cancelled") {
					return
				} else {
					Alert.alert(
						"Delete Account",
						"Your request for account deletion has been sent and will be completed within 5 business days. An email will be sent once your account is removed",
						[
							{
								text: "OK",
								onPress: () => logout(true),
								style: "cancel",
							},
						]
					)
				}
			}
		)
	}

	return (
		<View style={styles.mainContainer}>
			{/* <View style={styles.screenContainer}> */}
			<Card
				containerStyle={{
					width: windowWidth,
					paddingLeft: 20,
					margin: 0,
					borderWidth: 0,
					backgroundColor: "#F3F3F3",
					paddingTop: 30,
					paddingBottom: 20,
				}}
			>
				<Text style={styles.title}>
					{userFirstName} {userLastName}
				</Text>
				<Text style={styles.title1}>P: {userPhone}</Text>
				<Text style={styles.title1}>E: {userEmail}</Text>
			</Card>
			{/* </View> */}
			<View style={{ width: windowWidth, marginLeft: windowWidth * 0.02, marginBottom: 20 }}>
				{listData.map((item, i) => (
					<TouchableOpacity onPress={() => onPressItem(item)}>
						<ListItem key={i} bottomDivider>
							<ListItem.Content style={{ flexDirection: "row" }}>
								<ListItem.Title style={styles.title2}>
									{" "}
									{item.switch ? (biometryType ? biometryType : item.title.name) : item.title.name}
								</ListItem.Title>
								{connected ? <ListItem.Title>{item.status}</ListItem.Title> : <ListItem.Title></ListItem.Title>}
							</ListItem.Content>
							{item.switch ? (
								<Switch
									value={item.value}
									onValueChange={(value) => onValueChange(value, i)}
									style={{ marginRight: 10 }}
									// ios_backgroundColor={Colors.olive}
									thumbColor={Colors.white}
									trackColor={{ false: Colors.lightGrey, true: Colors.olive }}
								/>
							) : (
								<EIcon size={26} name="chevron-right" type="feather" color={'gray'} />
							)}
						</ListItem>
					</TouchableOpacity>
				))}
			</View>
			<View style={styles.bottomView1}>
				<TouchableOpacity style={styles.button} onPress={() => logout(true)}>
					<Text style={styles.buttonText}>SIGN OUT</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.bottomView}>
				<Image source={Images.logoWhite} style={{ width: 200 }} />
				<TouchableOpacity
					style={{ backgroundColor: "#323232", width: 50, height: 100 }}
					onPress={async () => {
						setModalVisible(true), await analytics().logEvent("menu")
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
							disabled={!connected}
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
					<TouchableOpacity style={{ backgroundColor: "#323232", width: 50 }} onPress={() => setModalVisible(false)}>
						<Icon name="menu" size={35} color="#fff" />
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
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
		padding: 20,
	},
	bottomView1: {
		width: "100%",
		height: 80,
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
