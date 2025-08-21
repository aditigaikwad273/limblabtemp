import { useEffect, useRef, useCallback, useState } from "react"
import { Client as ConversationsClient } from "@twilio/conversations"
import NotificationService from './NotificationService';
import PushNotification from "react-native-push-notification"
import { Platform } from 'react-native'

const useAppMessageNotification = () => {
    const totalUnReadMessagesRef = useRef(0)
    const conversationUnreadCounts = useRef({})
    const conversationClient = useRef(null)
    const [deviceToken, setDeviceToken] = useState(null)
    const [conversationSID, setConversationSID] = useState('')
    const [isAppInFocus, setIsAppInFocus] = useState(true)
    const [refreshNewCount, setRefreshNewCount] = useState(false)
    const [dummyCounter, setDummyCounter] = useState(0)//dumycounter to track every time app gets focus
    const androidOSName = 'android'

    useEffect(() => {
        if (conversationSID === '') {
            return
        }
        /*let firstUpdateReason = ''
        if (updateReasons.length > 0) {
            firstUpdateReason = updateReasons[0]
        }*/
            
        //if (firstUpdateReason !== 'lastReadMessageIndex') {
            //const latestMessagr = await conversation?.getMessages(1)
            //console.log("Latest message in conversation:", latestMessagr)
            //const authorParticipant = await latestMessagr.items[0].getParticipant()
            //console.log("Participant author in conversation:", authorParticipant)
            //if (authorParticipant.identity !== userEmailRef.current) {
                let total = totalUnReadMessagesRef.current
                total += 1

                //const withUnRead = await conversation.getUnreadMessagesCount()
                //console.log("Unread messages for participant:", withUnRead)
                console.log("total:", totalUnReadMessagesRef.current)
                //console.log("conversationUnreadCounts key val:", conversationUnreadCounts.current[conversation.sid])
                //total -= conversationUnreadCounts.current[conversation.sid] || 0
                //console.log("total -=", total)
                //total += withUnRead
                //console.log("total +=", total)
                conversationUnreadCounts.current[conversationSID] += 1
                console.log("conversationUnreadCounts", conversationUnreadCounts.current)
                totalUnReadMessagesRef.current = total
                console.log("Unread messages overall:", totalUnReadMessagesRef.current)
                
                if (Platform.OS === androidOSName) {
                    const n = new NotificationService()
                    n.removeAllDeliveredNotifications()
                    PushNotification.setApplicationIconBadgeNumber(0)
                }
                
                console.log("Cleared badge count to 0 in twilioConversationClientOnConversationUpdate")
                setRefreshNewCount(true)
                setConversationSID('')                    
            //}
        //}
    }, [conversationSID])

    useEffect(() => {
        if (refreshNewCount) {
            if (Platform.OS === androidOSName) {
                const n = new NotificationService()
                if (!isAppInFocus) {
                    n.localNotif('You have a new LimbLab message waiting for you')
                }
                else{
                    n.badgeCountUpdateOnlyNotif()
                }
            }
            
            console.log("badge count setting to: ", totalUnReadMessagesRef.current)
            PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
            setRefreshNewCount(false)
        }
        
    }, [refreshNewCount])
/*
    useEffect(() => {
        const fetchConversation = async () => {
            console.log("Fetching conversation with SID:", conversationSID)
            console.log("Fetching conversation with Conversation client:", conversationClient.current)
            if (conversationClient.current && conversationSID && isAppInFocus) {
                console.log("Fetching conversation by SID:", conversationSID)
                let cv = await conversationClient.current.getConversationBySid(conversationSID)
                console.log("Fetched conversation by SID:", cv)
                await twilioConversationClientOnConversationUpdate(cv, ['lastReadMessageIndex'])
            }
        }

        fetchConversation()

    }, [conversationSID])
*/
    useEffect(() => {        
        if (deviceToken && deviceToken !== '') {
            console.log("Setting up Twilio Conversations client with device token:")
            setDummyCounter(0);//reset on login
            conversationClient.current = new ConversationsClient(deviceToken)
            //userSubscribedConv.on("initialized", twilioConversationClientOnInit)
        }
        /*
        return () => {
            if (conversationClient.current) {
                conversationClient.current.off("initialized", twilioConversationClientOnInit)
                //conversationClient.current.off("conversationUpdated", twilioConversationClientOnConversationUpdate)
            }
        }*/
    }, [deviceToken])

    useEffect(() => {
        const twilioConversationClientOnInit = async () => {
            if (conversationClient.current){
                console.log("Refreshing badge count on focus:")
                let totalUnReadMessages = 0
                const conversationList = await conversationClient.current.getSubscribedConversations()
                while(1){
                    for (let i = 0; i < conversationList.items.length; i++) {
                        const item = conversationList.items[i]
                        const withUnRead = await item.getUnreadMessagesCount()
                        conversationUnreadCounts.current[item.sid] = withUnRead || 0
                        totalUnReadMessages += withUnRead
                    }
                    if (conversationList.hasNextPage) {
                        conversationList = await conversationList.nextPage()
                    }
                    else {
                        break
                    }
                }
                totalUnReadMessagesRef.current = totalUnReadMessages

                const n = new NotificationService()
                if (totalUnReadMessages === 0) {
                    n.removeAllDeliveredNotifications()
                    PushNotification.setApplicationIconBadgeNumber(0)
                }
                if (totalUnReadMessages > 0) {
                    if (Platform.OS === androidOSName) {
                        n.badgeCountUpdateOnlyNotif()
                    }
                    PushNotification.setApplicationIconBadgeNumber(totalUnReadMessages)
                }
                //conversationClient.current.on("conversationUpdated", twilioConversationClientOnConversationUpdate)
            }        
        }

        twilioConversationClientOnInit()
    }, [dummyCounter])

    const pushUnReaMessagesCountNotificationOnLogin = (dt) => {
        //deviceToken.current = deviceToken
        setDeviceToken(dt)
        setDummyCounter(prevVal => prevVal + 0.5) // Increment to trigger re-render
        console.log("Device token set in pushUnReaMessagesCountNotificationOnLogin:")
        //userEmailRef.current = ue
    }

    const pushUnReaMessagesCountNotificationOnConversationUpdate = (convSID, isAppFocussed) => {
        console.log("Current state on Conversation SI and isAppFocused")
        console.log(conversationSID, isAppInFocus)
        setConversationSID(convSID)
        setIsAppInFocus(isAppFocussed)
        console.log("Set the state on Conversation SI and isAppFocused")
        console.log(convSID, isAppFocussed)
    }

    const markConversationRead = (convSID) => {
        if (conversationUnreadCounts.current[convSID] > 0) {
            console.log("Marking conversation as read:", convSID)
            totalUnReadMessagesRef.current -= conversationUnreadCounts.current[convSID]
            conversationUnreadCounts.current[convSID] = 0
            console.log("Marked conversation as read:", convSID)
            const n = new NotificationService()
            n.removeAllDeliveredNotifications()
            PushNotification.setApplicationIconBadgeNumber(0)
            //setIsAppInFocus(true)
            //setRefreshNewCount(true)
        }
    }

    return {pushUnReaMessagesCountNotificationOnLogin
        , pushUnReaMessagesCountNotificationOnConversationUpdate
        , markConversationRead};
}

export default useAppMessageNotification;