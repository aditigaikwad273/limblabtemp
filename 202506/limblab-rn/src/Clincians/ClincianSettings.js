import React, { useState, useEffect, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	Image,
	Pressable,
	Dimensions,
	Linking,
	Platform,
	TouchableOpacity,
	Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { ListItem, Icon, Switch } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import { RFValue } from "react-native-responsive-fontsize"
import Modal from "react-native-modal"
import { Card } from "react-native-elements"
import Mailer from "react-native-mail"
import AsyncStorage from "@react-native-async-storage/async-storage"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default ClinicianSettings = (props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const [notificationState, setNotificationState] = useState(false)
	const toggleSwitch = () => setNotificationState((previousState) => !previousState)
	const { user, mainUser, setMainUser, logout } = useContext(AuthContext)
	const navigation = useNavigation()
	const userFirstName = user.data.first_name
	const userLastName = user.data.last_name
	const userTitle = user.data.title
	const userPhone = user.data.phone
	const userEmail = user.data.email
	const [biometryType, setBiometryType] = useState("")

	// useEffect(() => {
	// 	PushNotification.checkPermissions(permissions => {
	// 			// 		if (permissions.alert !== true) {
	// 		  setNotificationState(false);
	// 		} else {
	// 		  setNotificationState(true);
	// 		}
	// 	  });
	// },[notificationState])

	const list = [
		{
			title: "Notifications",
			link: "NotificationScreen",
		},
		{
			title: "Reset Password",
			link: "ForgotClinicianPassword",
		},
		{
			title: "Biometric Login",
			switch: true,
			value: false,
		},
		{
			title: "Delete Account",
			link: () => confirmAlert(),
		},
	]
	const [listData, setListData] = useState(list)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const value = await AsyncStorage.getItem("biometricEnabled")
				console.warn("value", value)
				const type = await AsyncStorage.getItem("BiometryType")
				setBiometryType(type)
				onValueChange(value === "true", 2)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		fetchData()
	}, [])

	const onPressItem = (item) => {
		if (typeof item.link === "string") {
			navigation.navigate(item.link)
		} else if (item.title == "Delete Account") {
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
				<Text style={styles.title1}>{userTitle}</Text>
				<Text style={styles.title1}>E: {userEmail}</Text>
			</Card>
			{/* </View> */}
			<View style={{ width: windowWidth, marginLeft: windowWidth * 0.02, marginBottom: 40 }}>
				{listData.map((item, i) => (
					<TouchableOpacity onPress={() => onPressItem(item)}>
						<ListItem key={i} bottomDivider>
							<ListItem.Content style={{}}>
								<ListItem.Title style={styles.title2}>
									{item.switch ? (biometryType ? biometryType : item.title) : item.title}
								</ListItem.Title>
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
								<Icon size={26} name="chevron-right" type="feather" color={'gray'} />
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
		padding: 30,
	},
	bottomView1: {
		width: "100%",
		height: 80,
		position: "absolute", //Here is the trick
		bottom: 0, //Here is the trick
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
