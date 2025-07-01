// import React, { useState, useCallback, useEffect, useContext } from 'react'
// import { View, StyleSheet, Text, RefreshControl, Dimensions, Image } from "react-native"
// import { SafeAreaView } from "react-native-safe-area-context"
// import { Styles, Colors, Images } from "../theme/Index"
// import { GiftedChat, Bubble, InputToolbar, MessageText, Actions } from 'react-native-gifted-chat';
// import { AuthContext } from '../utils/authContext'
// import { Client as ConversationsClient } from "@twilio/conversations";
// import axios from 'axios';
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// export default MessageScreen = (props) => {
// 	const {user, mainUser, setMainUser, logout} = useContext(AuthContext);
// 	const userCode = user.data.api_token
// 	const [messages, setMessages] = useState([]);
// 	const [connection, setConnection] = useState()
// 	const [conversations, setConversations] = useState()
// 	const [refreshing, setRefreshing] = React.useState(false);
// 	const[test, setTest] = useState()
// 	const [urgency, setUrgent] = useState('0')

//
// 	useEffect(() => {
// 		const token = user.data.twilio_token
// 		const initConversations = async () => {
// 			// // 		 conversationsClient = ConversationsClient;
// 		  // 		let conversationsClient = await ConversationsClient.create(token);
// 		//  // 		 setConnection({ statusString: "Connecting to Twilio…" });

// 		 conversationsClient.on("connectionStateChanged", (connection) => {
// 		  if (connection === "connecting")
// 			setConnection({
// 			  statusString: "Connecting to Twilio…",
// 			  status: "default"
// 			});
// 			//
// 		  if (connection === "connected") {
// 			setConnection({
// 			  statusString: "You are connected.",
// 			  status: "success"
// 			});
// 			conversationsClient.on("conversationJoined", async (conversation) => {
// 				setConversations({ conversations: conversation });
// 				loadMessagesFor(conversation)
// 			  });

// 		conversationsClient.on('messageAdded', (message) => {
// 			// 			const newMessage = parseMessage(message);
// 			const { giftedId } = message.attributes;
// 			if (giftedId) {
// 			  setMessages((prevMessages) => {
// 				if (prevMessages.some(({ _id }) => _id === giftedId)) {
// 				  return prevMessages.map((m) => (m._id === giftedId ? newMessage : m));
// 				}
// 				return [newMessage, ...prevMessages];
// 			  });
// 			}
// 		  });
// 	  }
// 		  if (connection === "disconnecting")
// 			setConnection({
// 			  statusString: "Disconnecting from Twilio…",
// 			  conversationsReady: false,
// 			  status: "default"
// 			});
// 		  if (connection === "disconnected")
// 			setConnection({
// 			  statusString: "Disconnected.",
// 			  conversationsReady: false,
// 			  status: "warning"
// 			});
// 		  if (connection === "denied")
// 			setConnection({
// 			  statusString: "Failed to connect.",
// 			  conversationsReady: false,
// 			  status: "error"
// 			});
// 		});
// 	 conversationsClient.on("conversationLeft", (thisConversation) => {
// 		setsetConversations({
// 		  conversations: [conversations.filter((it) => it !== thisConversation)]
// 		});
// 	  });
// 	}
// 	  initConversations()
// 	}
// 	, [])

// 	  useEffect(() => {
// 		axios.post("https://app.limblab.com/api/v1/client/conversations",{},{headers:{'X-LL-API-KEY': 'a21131ea-4d13-4c9e-a08d-c1783e67ed87',"X-LL-API-TOKEN":userCode}})
// 		.then(response => {
//
// 				if (response) {
// 					setTest(response.data.api_token)
// 					return response;
// 				} else {
// 					setTest(response)
//
// 				}
// 	   }) .catch ((error) => {
//
// })}, [])

// const loadMessagesFor = async (convo) => {
// 	// 	if(props.route.params !== convo.sid){
// 		// 		return
// 	}
//     if (convo.sid === props.route.params) {
// 		//        await convo?.getMessages()
//             .then(messagePaginator => {
// 				//                 if (convo) {
// 					const newList = parseMessages(messagePaginator.items)
// 					// 					setMessages(newList)
//                 }
//             })
//             .catch(err => {
//                 console.error("Couldn't fetch messages IMPLEMENT RETRY", err);

//             });
//     }
//   };

//   const  parseMessages = (messages) => {
//     return messages.map(parseMessage).reverse();
//   }
//  const parseMessage= (message) => {
//     return {
//       _id: message?.state?.sid,
//       text: message?.state?.body,
//       createdAt: message?.state?.timestamp,
//       user: {
//         _id: message?.state?.author,
//         name: message?.state?.author,
//       },
//       received: true,
//     };
//   }

//   const parseMessage1 = (message) => {
//     return {
//       _id: message?._id,
//       text: message?.text,
//       createdAt: message?.createdAt,
//       user: {
//         _id: message?.user._id,
//         name: `${user.data.firstName, user.data.lastName}`,
//       },
//       received: true,
//     };
//   }

//  const messageAdded = (message, targetConversation) => {
//     if (targetConversation === conversations?.conversations){
// 	const newMessage = parseMessage1(message)
//  }};

//  const urgentMessage = newMessages => {
// 	// if(urgent){
// 	return attributes = {giftedId: newMessages[0]._id, urgent}
// } else{
// 	return attributes = { giftedId: newMessages[0]._id};
// }
// 	}

//   const onSend = useCallback((newMessages = []) => {
//
// 	const attributes = { giftedId: newMessages[0]._id, urgency };
//     setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

// 	conversations?.conversations?.sendMessage(newMessages[0].text, attributes  );
// 	// messageAdded(newMessages[0], conversations?.conversations)
//
//   }, [messages]);

// 	// 	return (

// 			<GiftedChat
// 			renderUsernameOnMessage={true}
// 			messages={messages}
// 			messagesContainerStyle={styles.messageContainer}
// 			onSend={(messages) => onSend(messages)}
// 			user={{
// 				_id: user.data.email,
// 				name: `${user.data.firstName, user.data.lastName}`
// 			  }}
// 			  loadEarlier={true}
// 			  showAvatarForEveryMessage={true}
// 			  renderInputToolbar={props => ( <InputToolbar {...props} primaryStyle={{ alignItems: 'flex-end' }} /> )}
// 			  renderActions = {props => (
// 				<Actions
// 				  {...props}
// 				  containerStyle={{
// 					width: 44,
// 					height: 44,
// 					alignItems: 'center',
// 					justifyContent: 'center',
// 					marginLeft: 2,
// 					marginRight: 4,
// 					marginBottom: 0,
// 				  }}
// 				  icon={() => (
// 					<Image
// 					  style={{ width: 26, height: 26 }}
// 					  source={Images.icnChatOptions}
// 					/>
// 				  )}
// 				  options={{
// 					'URGENT': () => {
// 						setUrgent('1')
// 						// 					  },
// 					'URGENT 1': () => {
// 						// 					  },
// 					Cancel: () => {
// 					  // 					},
// 				  }}
// 				//   optionTintColor="#222B45"
// 				/>
// 			  )}
// 			  renderBubble={props => {
// 				return (
// 				  <Bubble
// 					{...props}
// 					wrapperStyle={{
// 						left: {
// 						  backgroundColor: 'white',
// 						  color: 'black'
// 						},
// 						right:{
// 							backgroundColor:'#d8dada',
// 							color:'black'
// 						}
// 					}}
// 				  />
// 				);
// 			  }}
// 			  renderMessageText = {props => (
// 				<MessageText
// 				  {...props}
// 				  containerStyle={{
// 					left: { backgroundColor: 'white', paddingTop:10 },
// 					right: { backgroundColor: '#d8dada', paddingTop:10 },
// 				  }}
// 				  textStyle={{
// 					left: { color: '#576C64' },
// 					right: { color: '#576C64' },
// 				  }}
// 				  linkStyle={{
// 					left: { color: 'orange' },
// 					right: { color: 'orange' },
// 				  }}
// 				  customTextStyle={{ fontSize: 22,  }}
// 				/>
// 			  )}
// 	 		/>

// 	)
// }

// const styles = StyleSheet.create({
// 	...Styles,
// 	messageContainer: {
// 		backgroundColor: '#f2f1f1',

// 	  },
// })
