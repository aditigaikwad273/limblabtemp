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
    //const [isAppInFocus, setIsAppInFocus] = useState(true)
    const [eventFired, setEventFired] = useState('')
    const [refreshNewCount, setRefreshNewCount] = useState(false)
    //const [foreGroundActivateUnReadCount, setForeGroundActivateUnReadCount] = useState(0)
    const [dummyCounter, setDummyCounter] = useState(0)//dumycounter to track every time app gets focus
    const userEmailRef = useRef('')
    const androidOSName = 'android'

    const foregroundNotification = 'foregroundNotification'
    const backgroundNotification = 'backgroundNotification'
    const backgroundActivation = 'backgroundActivation'

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
            if (eventFired != backgroundActivation) {
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
            }
                
            /*
            if (Platform.OS === androidOSName) {
                const n = new NotificationService()
                n.removeAllDeliveredNotifications()
                PushNotification.setApplicationIconBadgeNumber(0)
            }*/
                
            if (eventFired != foregroundNotification) {
                setRefreshNewCount(true)
            }
            
            setConversationSID('')
            //}
        //}
    }, [conversationSID])

    useEffect(() => {
        if (refreshNewCount) {
            if (Platform.OS === androidOSName) {
                const n = new NotificationService()
                if (eventFired === backgroundNotification) {
                    n.localNotif('You have a new LimbLab message waiting for you')
                }
                else if (eventFired === backgroundActivation) {
                    console.log('Kapil, Changing the background activation badge count')
                    n.badgeCountUpdateOnlyNotif()//update badge count only if any notification recd in foreground
                }
            }

            console.log("badge count setting to: ", totalUnReadMessagesRef.current)
            PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
            
            setRefreshNewCount(false)
        }   
    }, [refreshNewCount])

    const twilioConversationClientOnInit2 = async () => {
            if (conversationClient.current){
                console.log("Refreshing badge count on focus:")
                let totalUnReadMessages = 0
                try {
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
                    n.cancelOnlyLastSilentNotif()
                }
                catch(e){
                    console.log(e)
                }
            }        
        }

    const twilioConversationUpdated = async ({ conversation, updateReasons }) => {
        if (conversation._internalState.uniqueName != userEmailRef.current) {
            setConversationSID(conversation)
            setEventFired(foregroundNotification)
        }
    }

    useEffect(() => {        
        if (deviceToken && deviceToken !== '') {
            conversationClient.current = new ConversationsClient(deviceToken)
            console.log("Setting up Twilio Conversations client with device token:")
            //setDummyCouner(0.5);//reset on login
            conversationClient.current.on("initialized", twilioConversationClientOnInit2)
            conversationClient.current.on("conversationUpdated", twilioConversationUpdated)
        }
        
        return () => {
            if (conversationClient.current) {
                conversationClient.current.off("initialized", twilioConversationClientOnInit2)
                conversationClient.current.off("conversationUpdated", twilioConversationUpdated)
            }
        }
    }, [deviceToken])

    useEffect(() => {
        const twilioConversationClientOnInit = async () => {
            if (conversationClient.current && dummyCounter > 0.5){//not for first time, since that fires from oninitialize
                console.log("Refreshing badge count on focus:")
                let totalUnReadMessages = 0
                try {
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
                    n.cancelOnlyLastSilentNotif()
                    //PushNotification.setApplicationIconBadgeNumber(0)
                }
                catch(e){
                    console.log(e)
                }
            }        
        }

        twilioConversationClientOnInit()
    }, [dummyCounter])

    const onForegroundActivation = (dt, uemail) => {
        console.log('dt', dt)
        setDeviceToken(dt)
        userEmailRef.current = uemail
        console.log('dummyCounter', dummyCounter)
        setDummyCounter(prevVal => prevVal + 0.5) // Increment to trigger re-render
        console.log("Device token set in pushUnReaMessagesCountNotificationOnLogin:")
    }

    const onBackGroundNotificationReceived = (convSID) => {
        setConversationSID(convSID)
        setEventFired(backgroundNotification)
    }

    const onBackGroundActivation = () => {
        setConversationSID('backGroundActivationSID')
        setEventFired(backgroundActivation)
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

    return {onForegroundActivation: onForegroundActivation
        ,onBackGroundNotificationReceived: onBackGroundNotificationReceived
        ,onBackGroundActivation: onBackGroundActivation
        ,markConversationRead};
}

export default useAppMessageNotification;