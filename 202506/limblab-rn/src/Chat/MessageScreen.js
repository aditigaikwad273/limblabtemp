import React, { useState, useCallback, useEffect, useContext } from "react"
import {
	View,
	StyleSheet,
	Text,
	RefreshControl,
	Dimensions,
	Image,
	Platform,
	ActivityIndicator,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Styles, Colors, Images } from "../theme/Index"
import {
	GiftedChat,
	Bubble,
	InputToolbar,
	MessageText,
	Actions,
	Message,
	Send,
	Composer,
} from "react-native-gifted-chat"
import analytics from "@react-native-firebase/analytics"
import { Button, Input } from "../componenets/Index"
import Modal from "react-native-modal"
import { AuthContext } from "../utils/authContext"
import { Client, MessageBuilder } from "@twilio/conversations"
import createAxiosInstance from "../utils/API"
import { useRoute } from "@react-navigation/native"
// import { parseMessage } from '../utils/parse';
import Spinner from "../componenets/Spinner"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import Video from "react-native-video"
import VideoPlayer from "./VideoPlayer"
import uuid from "react-native-uuid"
import NotificationService from '../utils/NotificationService';

export default MessageScreen = (props) => {
	const { user, mainUser, setMainUser, logout } = useContext(AuthContext)
	const route = useRoute()
	const sid = route.params?.sid
	const userCode = user?.data?.api_token
	const userRole = user?.data?.role
	const [loading, setLoading] = useState(true)
	const [messages, setMessages] = useState([])
	const [tempMessages, setTempMessages] = useState([])
	const [conversation, setConversation] = useState(null)
	const [urgency, setUrgency] = useState("0")
	const [image, setImage] = useState(null)
	const [height, setHeight] = useState(16)
	const [modalVisible, setModalVisible] = useState(false)
	const [clinician, setClinician] = useState()
	const [showImage, setShowImage] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)

	useEffect(() => {
		if (userRole === "client") {
			const fetchData = async () => {
				const api = createAxiosInstance(userCode)
				await api.post(`/api/v1/client/conversations`)

				const response = await api.get("/api/v1/client/relationships")
				if (response.data.length > 0) {
					setClinician(response.data[0])
				}
			}

			fetchData()
		}
		const n = new NotificationService()
		n.removeAllDeliveredNotifications()
	}, [userRole])

	const fetchData = async () => {
		try {
			let conversationsClient = new Client(user.data.twilio_token)

			conversationsClient.on("conversationAdded", async (conversation) => {
				if (!sid || sid === conversation.sid) {
					let convo = await conversationsClient.getConversationBySid(conversation.sid)
					setConversation(conversation)
					loadMessagesFor(convo)
				}
			})

			conversationsClient.on("messageAdded", (message) => {
				if (!sid || sid === message.conversation.sid) {
					const { giftedId } = message.attributes
					if (giftedId) {
						const newMessage = parseMessage(message)
						setMessages((prevMessages) => {
							const index = prevMessages.findIndex(({ _id }) => _id === giftedId)
							if (index !== -1) {
								prevMessages[index] = newMessage
								return prevMessages
							}
							return [newMessage, ...prevMessages]
						})
					}
				}
			})
		} catch (error) {
			console.log("error-conversationsClient-catch", error)
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [sid])

	useEffect(() => {
		if (tempMessages.length > messages.length) setMessages(tempMessages)
	}, [tempMessages])

	const loadMessagesFor = async (convo) => {
		try {
			const messagePaginator = await convo?.getMessages(900)
			if (messagePaginator.items) {
				convo?.setAllMessagesRead()
				const results = await Promise.all(messagePaginator.items.reverse().map(parseMessage))
				setTempMessages(results)
			}
			setLoading(false)
		} catch (error) {
			console.log("messagePaginator-error", error)
			setLoading(false)
		}
	}
	const parseMessage = async (message) => {
		const categorizedMedia = message.getMediaByCategories(["media"])

		let msg = {
			_id: message?.state?.sid,
			text: message?.state?.body,
			createdAt: message?.state?.timestamp,
			user: {
				_id: message?.state?.author,
				name: message?.state?.author,
			},
			received: true,
			read: false,
			urgent: message?.state.attributes.urgency,
		}

		if (categorizedMedia.length > 0) {
			let url = await categorizedMedia[0].getContentTemporaryUrl()
			if (categorizedMedia[0]?.contentType?.includes("video")) {
				msg.video = url
			} else {
				msg.image = url
			}
		}
		// if (mediaUrl) {
		// 	data.image = mediaUrl
		// }
		return msg
	}

	const onSend = async (newMessages = [{}]) => {
		setMessages((prevMessages) => {
			newMessages[0].urgent = urgency
			newMessages[0].user = { _id: user.data.email }
			newMessages[0]._id = uuid.v4()
			return GiftedChat.append(prevMessages, newMessages)
		})

		const formData = new FormData()
		if (image?.uri) {
			formData.append("file", {
				uri: image?.uri,
				type: image?.type,
				name: image?.fileName,
			})
			if (image?.type.includes("video")) {
				newMessages[0].video = image?.uri
				newMessages[0].imageDetail = image
			} else {
				newMessages[0].image = image?.uri
				newMessages[0].imageDetail = image
			}
		}
		try {
			if (image?.uri) {
				conversation
					?.prepareMessage()
					.setBody("")
					.addMedia(formData)
					.build()
					.send()
					.then((index) => {
						conversation?.updateLastReadMessageIndex(index)
					})
			} else {
				conversation
					?.prepareMessage()
					.setBody(newMessages[0]?.text)
					.build()
					.send()
					.then((index) => {
						conversation?.updateLastReadMessageIndex(index)
					})
			}
			if (userRole === "client")
				analytics().logEvent("client_message_sent", { clinician: `${clinician?.first_name} ${clinician?.last_name}` })
			else
				analytics().logEvent("clinician_message_sent", { clinician: `${user.data.first_name} ${user.data.last_name}` })
		} catch (error) {
			console.log("error", error)
		}

		// conversation
		// 	?.sendMessage(newMessages[0].text, {
		//         MessageType:"",
		// 		giftedId: newMessages[0]._id,
		// 		urgency: urgency,
		// 		contentType: "image/jpg",
		// 		media: image?.uri,
		// 	})

		setImage()
		setUrgency("0")
	}
	//     ,
	// 	[conversation, messages, urgency]
	// )

	const renderMessageText = (props) => {
		const highlight = props.currentMessage.urgent === "1"

		return (
			<>
				<MessageText
					{...props}
					textStyle={{
						left: { color: highlight ? "white" : "#576C64", paddingTop: 10 },
						right: { color: highlight ? "white" : "#576C64", paddingTop: 10 },
					}}
					customTextStyle={{ fontSize: 20 }}
				/>
			</>
		)
	}
	// const actionIcon = () => {
	//   if(urgency === '0'){
	//     <Image
	//             style={{ width: 30, height: 28.3 }}
	//             source={Images.icnChatOptions}

	//           />
	//   } else {
	//     <Image
	//     style={{ width: 30, height: 28.3 }}
	//     source={Images.icnChatUrgent}
	//   />
	//   }
	// }

	const renderMessageImage = (props) => {
		const imageUrl = props.currentMessage.image;
		if (!imageUrl) return null;
		return (
			<TouchableOpacity onPress={() => {
				setShowImage(!showImage);
				setSelectedImage(imageUrl);
			}}>
				<Image source={{ uri: imageUrl }}
					style={{
						width: 160,
						height: 160,
						borderRadius: 8,
						margin: 3
					}}
					resizeMode="cover"
				/>
			</TouchableOpacity >
		);
	};

	const renderBubble = (props) => {
		const highlight = props.currentMessage.urgent === "1"

		return (
			<Bubble
				{...props}
				renderMessageText={renderMessageText}
				renderMessageImage={renderMessageImage}
				wrapperStyle={{
					left: {
						backgroundColor: highlight ? "#B54C84" : "white",
					},
					right: {
						backgroundColor: highlight ? "#B54C84" : "#d8dada",
					},
				}}
			/>
		)
	}

	if (loading) {
		return <Spinner title="Loading messages" />
	}
	const customInputToolbar = (props) => {
		return (
			<InputToolbar
				{...props}
				renderSend={(props) => (
					<Send
						{...props}
						containerStyle={{
							width: 30,
							height: 30,
							position: "absolute",
							bottom: 8,
							right: 17,
							justifyContent: "center",
						}}
					>
						<Image source={Images.icnSend} />
					</Send>
				)}
			></InputToolbar>
		)
	}
	const renderComposer = (props) => (
		<Composer
			{...props}
			multiline={true}
			textInputStyle={{
				paddingHorizontal: 15,
				paddingTop: 12,
				textAlignVertical: "center",
				alignSelf: "stretch",
				borderWidth: 1,
				borderColor: "#CACACE",
				borderRadius: 25,
				minHeight: 44,
				margin: 10,
				marginRight: 20,
			}}
			// onInputSizeChanged={(layout) => {
			// 	console.log("layout", layout)
			// 	setHeight(layout.height)
			// }}
			placeholder={"Type here..."}
		/>
	)

	const openPicker = async () => {
		const result = await launchImageLibrary({ mediaType: "mixed" })
		setImage(result.assets[0])
		setModalVisible(true)
		// onSend([
		// 	{
		// 		image: result.assets[0].uri,
		// 		imageDetail: result.assets[0],
		// 		urgent: urgency,
		// 	},
		// ])
		console.log("result", result.assets[0])
	}
	const openCamera = async () => {
		const result = await launchCamera({ mediaType: "mixed", quality: 0.5 })
		setImage(result.assets[0])
		setModalVisible(true)
		// onSend([
		// 	{
		// 		image: result.assets[0].uri,
		// 		imageDetail: result.assets[0],
		// 		urgent: urgency,
		// 	},
		// ])
		console.log("openCamera", result)
	}
	// <InputToolbar {...props} containerStyle={{ padding: 5 }} />
	return (
		<>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust as needed
			>
				<GiftedChat
					bottomOffset={1}
					isKeyboardInternallyHandled={true}
					renderUsernameOnMessage={true}
					messages={messages}
					messagesContainerStyle={styles.messageContainer}
					onSend={(messages) => onSend(messages)}
					alwaysShowSend={true}
					showAvatarForEveryMessage={true}
					user={{
						_id: user.data.email,
						name: `${(user.data.firstName, user.data.lastName)}`,
					}}
					renderMessageVideo={(props) => {
						return (
							<VideoPlayer
								url={props.currentMessage.video}
								style={{
									width: 200,
									height: 200,
									margin: 3,
									borderRadius: 5,
									overflow: "hidden",
									backgroundColor: "black",
								}}
							/>
						)
					}}
					renderSend={(props) => (
						<Send
							{...props}
							containerStyle={{
								width: 30,
								height: 30,
								bottom: 12,
								right: 10,
								justifyContent: "center",
							}}
						>
							<Image source={Images.icnSend} />
						</Send>
					)}
					renderComposer={renderComposer}
					// renderInputToolbar={customInputToolbar}
					renderActions={(props) => (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Actions
								{...props}
								wrapperStyle={{ backgroundColor: "green" }}
								containerStyle={{
									paddingTop: 3,
									margin: 5,
								}}
								icon={() => ({
									...(urgency === "0" ? <Image source={Images.icnImportant} /> : <Image source={Images.icnImportant} />),
								})}
								options={{
									URGENT: () => {
										setUrgency("1")
									},
									Cancel: () => {
										setUrgency("0")
									},
								}}
							/>
							<TouchableOpacity style={{ margin: 5 }} onPress={openCamera}>
								<Image source={Images.icnCamera} />
							</TouchableOpacity>
							<TouchableOpacity style={{ margin: 5, paddingTop: 4 }} onPress={openPicker}>
								<Image source={Images.icnPhoto} />
							</TouchableOpacity>
						</View>
					)}
					renderMessage={(props) => (
						<Message
							{...props}
							containerStyle={{
								right: {
									marginBottom: image?.uri ? 170 : 50,
								},
								left: {
									marginBottom: image?.uri ? 170 : 50,
								},
							}}
							renderBubble={renderBubble}
						/>
					)}
				/>
			</KeyboardAvoidingView>
			<Modal
				style={{ margin: 0 }}
				animationType="slide"
				transparent={false}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible)
				}}
			>
				<View style={{ alignItems: "center", justifyContent: "center" }}>
					{image?.type.includes("video") ? (
						<VideoPlayer
							disabled={true}
							url={image.uri}
							style={{
								width: 300,
								height: 300,
								margin: 3,
								borderRadius: 18,
								overflow: "hidden",
								backgroundColor: "black",
								marginBottom: 30,
							}}
						/>
					) : (
						<Image source={{ uri: image?.uri }} style={{ width: "95%", height: 300, margin: 30 }} />
					)}

					<View>
						<Button
							title="Send"
							fullWidthPadding={40}
							onPress={() => {
								setModalVisible(false)
								onSend()
							}}
						/>
						<TouchableOpacity onPress={() => setModalVisible(false)}>
							<Text style={styles.confirmText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal visible={showImage} style={{ margin: 0 }} animationType="slide" transparent={false} onRequestClose={() => { setShowImage(false); setSelectedImage(null) }}>
				<View style={{ flex: 1, backgroundColor: 'black', width: '100%', height: '100%', padding: 20 }}>
					<TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 50 }} onPress={() => { setShowImage(false); setSelectedImage(null) }}>
						<Text style={{ color: 'white', fontSize: 20 }} >Close</Text>
					</TouchableOpacity>

					<Image source={{ uri: selectedImage }}
						style={{ width: '100%', height: '100%' }}
						resizeMode="contain"
					/>
				</View>
			</Modal>

		</>
	)
}

const styles = StyleSheet.create({
	...Styles,
	messageContainer: {
		backgroundColor: "#f2f1f1",
		// backgroundColor: "red",
		// marginBottom: -10,
	},

	confirmText: {
		...Styles.boldFont,
		fontSize: 18,
		color: Colors.olive,
		textAlign: "center",
		paddingTop: 20,
	},
})
