import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet, Text, Image, FlatList, Animated, Dimensions, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
// import { LiquidLike } from "react-native-animated-pagination-dots"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RFValue } from "react-native-responsive-fontsize"
import { TouchableOpacity } from "react-native"
import firebase from "@react-native-firebase/app"
import analytics from "@react-native-firebase/analytics"
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default OnboardingScreen = (props) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const scrollX = useRef(new Animated.Value(0)).current
	const flatListRef = useRef(null)

	useEffect(() => {
		AsyncStorage.setItem("isFirstOpen", "true")

		flatListRef.current.scrollToIndex({
			index: activeIndex,
			animated: true,
		})
	}, [activeIndex])

	// useEffect(() => {
	//     firebase.app();
	//     analytics().setCurrentScreen(`${item.title}`);
	// })

	const onboardingScreens = [
		{
			key: "1",
			image: Images.logoBig,
			title: "Welcome to Limb Lab",
			subtitle: "The journey begins with you.",
			body: "At Limb Lab, we are committed to transforming your challenges into a happier, healthier life, with more function and possibility.",
			buttonText: "Learn More",
		},
		{
			key: "2",
			image: Images.onboardingChat,
			title: "Chat",
			subtitle: "With Your Clinician",
			body: "Let’s connect you with your trusted clinician!",
			buttonText: "Next",
		},
		{
			key: "3",
			image: Images.onboardingAccess,
			title: "Access",
			subtitle: "Helpful Resources",
			body: "We are here to help you every step of the way, even after you leave our offices. Check out our Resource Center to learn more about your device and device management.",
			buttonText: "Next",
		},
		{
			key: "4",
			image: Images.onboardingNotifications,
			title: "Notifications",
			subtitle: "Stay In Touch & Up To Date",
			body: "Turn on notifications to receive alerts when a new message arrives for you in the app.",
			buttonText: "Next",
		},
	]

	return (
		<SafeAreaView style={styles.pageContainer}>
			<Animated.FlatList
				data={onboardingScreens}
				ref={flatListRef}
				keyExtractor={(item) => item.key}
				showsHorizontalScrollIndicator={false}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
					useNativeDriver: true,
				})}
				onMomentumScrollEnd={(scrollEvent) => {}}
				pagingEnabled
				horizontal
				scrollEnabled={false}
				scrollEventThrottle={16}
				renderItem={({ item, index }) => {
					return (
						<View style={styles.itemContainer}>
							<Image source={item.image} resizeMethod={"auto"} resizeMode={"contain"} />
							<Text style={index === 0 ? styles.introTitle : styles.title}>{item.title}</Text>
							<Text style={index === 0 ? styles.introSubtitle : styles.subtitle}>{item.subtitle}</Text>
							<Text style={styles.body}>{item.body}</Text>
							<View style={styles.actionContainer}>
								<TouchableOpacity
									style={styles.button}
									onPress={async () => {
										try{
											await analytics().logEvent("onboarding", {
											page: item.title,
										})
										if (item.title === "Welcome to Limb Lab") {
											await analytics().logEvent("onboarding_start")
										}
										if (item.title === "Notifications") {
											await analytics().logEvent("onboarding_last")
										}
										if (index + 1 < onboardingScreens.length) {
											setActiveIndex(activeIndex + 1)
										} else if (index + 1 == onboardingScreens.length) {
											AsyncStorage.setItem("onboardingComplete", "yes")
											props.navigation.replace("LandingScreen")
										}
										}catch (error) {
											console.error("Error logging onboarding event:", error)
										}
									}}
								>
									<Text style={styles.buttonText}>{item.buttonText}</Text>
								</TouchableOpacity>
							</View>
						</View>
					)
				}}
			/>

			{/* <LiquidLike
				data={onboardingScreens}
				scrollX={scrollX}
				scrollOffset={scrollX}
				dotSize={13}
				dotSpacing={6}
				inActiveDotOpacity={0.09}
				// inActiveDotColor={Colors.white}
				activeDotColor={Colors.darkGreen}
				containerStyle={{
					bottom: 50,
				}}
			/> */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	...Styles,
	pageContainer: {
		...Styles.mainContainer,
		alignItems: "center",
	},
	itemContainer: {
		flex: 1,
		width: windowWidth,
		alignItems: "center",
		marginTop: 60,
	},
	introTitle: {
		...Styles.sfSemiBoldFont,
		textAlign: "center",
		fontSize: RFValue(28),
		color: Colors.darkGreen,
		marginTop: windowHeight * 0.05,
	},
	introSubtitle: {
		...Styles.sfSemiBoldFont,
		textAlign: "center",
		fontSize: RFValue(20),
		color: Colors.olive,
	},
	title: {
		...Styles.regularFont,
		textAlign: "center",
		fontSize: RFValue(38),
		color: Colors.olive,
	},
	subtitle: {
		...Styles.semiBoldFont,
		textAlign: "center",
		fontSize: RFValue(20),
		color: Colors.darkGreen,
	},
	body: {
		...Styles.semiBoldFont,
		textAlign: "center",
		width: windowWidth * 0.65,
		marginTop: windowHeight * 0.02,
	},
	actionContainer: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 60,
	},
	button: {
		backgroundColor: Colors.darkGreen,
		borderRadius: 30,
		padding: 10,
		paddingHorizontal: 30,
		height: 50,
		justifyContent: "center",
		marginBottom: 20,
	},
	button1: {
		// backgroundColor: Colors.darkGreen,
		// borderRadius: 30,
		padding: 10,
		paddingHorizontal: 30,
		height: 50,
		justifyContent: "center",
		// marginTop:10
	},
	buttonText: {
		...Styles.boldFont,
		color: Colors.white,
		fontSize: RFValue(18),
		textAlign: "center",
	},
	buttonText1: {
		...Styles.boldFont,
		color: Colors.olive,
		fontSize: RFValue(18),
		textAlign: "center",
	},
})
