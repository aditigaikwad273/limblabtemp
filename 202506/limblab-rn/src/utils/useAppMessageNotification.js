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
    const [eventFired, setEventFired] = useState('')
    const [refreshNewCount, setRefreshNewCount] = useState(false)
    const [dummyCounter, setDummyCounter] = useState(0)//dumycounter to track every time app gets focus
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
                    n.badgeCountUpdateOnlyNotif()//update badge count only if any notification recd in foreground
                }
            }

            PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
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
                    const n = new NotificationService()
                    n.cancelOnlyLastSilentNotif()
                }
                catch(e){
                    console.log(e)
                }
            }        
        }

    useEffect(() => {        
        if (deviceToken && deviceToken !== '') {
            conversationClient.current = new ConversationsClient(deviceToken)
            //setDummyCouner(0.5);//reset on login
            conversationClient.current.on("initialized", twilioConversationClientOnInit2)
        }
        
        return () => {
            if (conversationClient.current) {
                conversationClient.current.off("initialized", twilioConversationClientOnInit2)
            }
        }
    }, [deviceToken])

    useEffect(() => {
        const twilioConversationClientOnInit = async () => {
            if (conversationClient.current && dummyCounter > 0.5){//not for first time, since that fires from oninitialize
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

    const onForegroundActivation = (dt) => {
        setDeviceToken(dt)
        setDummyCounter(prevVal => prevVal + 0.5) // Increment to trigger re-render
    }

    const onForegroundNotificationReceived = (convSID) => {
        setConversationSID(convSID)
        setEventFired(foregroundNotification)
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
            totalUnReadMessagesRef.current -= conversationUnreadCounts.current[convSID]
            conversationUnreadCounts.current[convSID] = 0
            const n = new NotificationService()
            n.removeAllDeliveredNotifications()
            PushNotification.setApplicationIconBadgeNumber(0)
        }
    }

    return {onForegroundActivation: onForegroundActivation
        ,onForegroundNotificationReceived: onForegroundNotificationReceived
        ,onBackGroundNotificationReceived: onBackGroundNotificationReceived
        ,onBackGroundActivation: onBackGroundActivation
        ,markConversationRead};
}

export default useAppMessageNotification;