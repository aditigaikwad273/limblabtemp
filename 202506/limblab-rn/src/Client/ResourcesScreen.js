import React, { useState, useEffect, useContext } from "react"
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, Pressable, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import { ListItem } from "react-native-elements"
import Modal from "react-native-modal"
import { RFValue } from "react-native-responsive-fontsize"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../utils/authContext"
import createAxiosInstance from "../utils/API"
import analytics from "@react-native-firebase/analytics"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default ResourcesScreen = (props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const { user, mainUser, setMainUser, logout } = useContext(AuthContext)
	const navigation = useNavigation()
	const userCode = user.data.api_token
	const [connected, setConnected] = useState(false)

	const list = [
		{
			title: "About Us",
			status: "https://limblab.com/about-us/",
		},

		{
			title: "Request an Appointment",
			status: "https://limblab.com/clients/",
		},
		{
			title: "Videos",
			redirect: "FoldersScreen",
		},
		{
			title: "Locations",
			status: "https://limblab.com/locations/",
		},
		{
			title: "LimbLab Store",
			status: "https://limblab.com/services/",
		},
		{
			title: "Privacy Policy",
			status: "https://limblab.com/privacy/",
			useLinking: true,
		},
		{
			title: "HIPAA Notice of Privacy Practices",
			status: "https://limblab.com/hipaa/",
			useLinking: true,
		},
		{
			title: "Terms and Conditions",
			status: "https://limblab.com/terms/",
		},
	]

	const payList = [
		{
			title: "Pay My Bill",
			status: "https://www.patientnotebook.com/82984/Enhanced",
		},
	]

	const payMyBill = () => {
		Linking.openURL("https://www.patientnotebook.com/82984/Enhanced")
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
	}, [])

	return (
		<SafeAreaView style={styles.mainContainer}>
			<View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
				<Image source={Images.logoBig} style={{ width: windowWidth * 0.8 }} />
			</View>
			<View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
				{/* <Text style = {{ width: windowWidth * .8, letterSpacing: 2, lineHeight: 25, textAlign:'left'}}>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</Text> */}
			</View>
			<View style={{ width: windowWidth, marginLeft: windowWidth * 0.03, textAlign: "left" }}>
				{list.map((item, i) => (
					<TouchableOpacity
						onPress={() => {
							if (item.redirect) {
								navigation.navigate(item.redirect)
							} else if (item.useLinking) {
								Linking.openURL(item.status)
							} else navigation.navigate("WebViewScreen", { params: item.status })
						}}
					>
						<ListItem key={i} bottomDivider>
							<ListItem.Content>
								<ListItem.Title style={{ textAlign: "left", paddingLeft: 0 }}>{item.title}</ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron size={26} />
						</ListItem>
					</TouchableOpacity>
				))}
				{payList.map((item, i) => (
					<TouchableOpacity onPress={payMyBill}>
						<ListItem key={i} bottomDivider>
							<ListItem.Content>
								<ListItem.Title style={{ textAlign: "left", paddingLeft: 0 }}>{item.title}</ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron size={26} />
						</ListItem>
					</TouchableOpacity>
				))}
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
