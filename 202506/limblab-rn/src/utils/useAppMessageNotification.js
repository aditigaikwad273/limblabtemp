import { useEffect, useRef, useCallback, useState } from "react"
import { Client as ConversationsClient } from "@twilio/conversations"
import NotificationService from './NotificationService';
import PushNotification from "react-native-push-notification"
import { Platform } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"

const useAppMessageNotification = () => {
    const totalUnReadMessagesRef = useRef(0)
    const conversationUnreadCounts = useRef({})
    const conversationLastReadMessageCreatedAt = useRef({})
    const conversationClient = useRef(null)
    const [deviceToken, setDeviceToken] = useState(null)
    const [conversationSID, setConversationSID] = useState('')
    const [eventFired, setEventFired] = useState('')
    const [refreshNewCount, setRefreshNewCount] = useState(false)
    const foreGroundActivateUnReadCountRef = useRef(0)
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
                //total -= conversationUnreadCounts.current[conversation.sid] || 0
                //total += withUnRead
                conversationUnreadCounts.current[conversationSID] += 1
                totalUnReadMessagesRef.current = total
            }
            else{
                const n = new NotificationService()
                n.cancelAll()
            }

             
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
                if (eventFired === backgroundNotification) {
                    const n = new NotificationService()
                    n.localNotif('You have a new LimbLab message waiting for you')
                    PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
                }
                else if (eventFired === backgroundActivation)
                {
                    if (foreGroundActivateUnReadCountRef.current > 0)
                    {       
                        const n = new NotificationService()             
                        n.badgeCountUpdateOnlyNotif()//update badge count only if any notification recd in foreground
                        PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
                    }
                }                
            }
            else{
                PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
            }
            
            setRefreshNewCount(false)
        }
    }, [refreshNewCount])

    const twilioConversationClientOnInit2 = async () => {
            if (conversationClient.current){
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
                    foreGroundActivateUnReadCountRef.current = 0
                    const n = new NotificationService()
                    n.cancelOnlyLastSilentNotif()
                }
                catch(e){
                    console.log(e)
                }
            }        
        }

    const twilioConversationUpdated = async ({ conversation, author, dateCreated }) => {
        try{
            if (author != userEmailRef.current) {
                const isoFormat = dateCreated.toISOString()
                await AsyncStorage.setItem("lastMessageCreatedAt", isoFormat)
                if (conversationLastReadMessageCreatedAt.current[conversation.sid])
                {
                    const lastMessageCreatedDate = new Date(conversationLastReadMessageCreatedAt.current[conversation.sid])
                    const messageCreatedDate = new Date(isoFormat)
                    if (messageCreatedDate > lastMessageCreatedDate){
                        foreGroundActivateUnReadCountRef.current += 1
                        conversationLastReadMessageCreatedAt.current[conversation.sid] = isoFormat
                        setConversationSID(conversation.sid)
                        setEventFired(foregroundNotification)
                    }
                }
                else {
                    foreGroundActivateUnReadCountRef.current += 1
                    conversationLastReadMessageCreatedAt.current[conversation.sid] = isoFormat
                    setConversationSID(conversation.sid)
                    setEventFired(foregroundNotification)
                }
            }
        }
        catch (e){
            console.log(e)
        }
    }

    useEffect(() => {        
        if (deviceToken && deviceToken !== '') {
            conversationClient.current = new ConversationsClient(deviceToken)
            //setDummyCouner(0.5);//reset on login
            //conversationClient.current.on("initialized", twilioConversationClientOnInit2)
            conversationClient.current.on("messageAdded", twilioConversationUpdated)
        }
        
        return () => {
            if (conversationClient.current) {
                //conversationClient.current.off("initialized", twilioConversationClientOnInit2)
                conversationClient.current.off("messageAdded", twilioConversationUpdated)
            }
        }
    }, [deviceToken])

    useEffect(() => {
        const twilioConversationClientOnInit = async () => {
            if (conversationClient.current){//not for first time, since that fires from oninitialize
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
                    foreGroundActivateUnReadCountRef.current = totalUnReadMessages

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
        setDeviceToken(dt)
        userEmailRef.current = uemail
        setDummyCounter(prevVal => prevVal + 0.5) // Increment to trigger re-render
    }

    const onBackGroundActivation = async () => {
        setConversationSID('backGroundActivationSID')
        setEventFired(backgroundActivation)
        await AsyncStorage.setItem("currentAppBadgeCount", totalUnReadMessagesRef.current.toString())
    }

    const markConversationRead = (convSID) => {
        if (conversationUnreadCounts.current[convSID] > 0) {
            totalUnReadMessagesRef.current -= conversationUnreadCounts.current[convSID]
            conversationUnreadCounts.current[convSID] = 0
            foreGroundActivateUnReadCountRef.current = 0
            const n = new NotificationService()
            n.removeAllDeliveredNotifications()
            n.cancelAll()
            //PushNotification.setApplicationIconBadgeNumber(0)
        }
    }

    return {onForegroundActivation: onForegroundActivation
        ,onBackGroundActivation: onBackGroundActivation
        ,markConversationRead};
}

export default useAppMessageNotification;