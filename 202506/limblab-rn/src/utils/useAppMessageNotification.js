import { useEffect, useRef, useCallback, useState } from "react"
import { Client as ConversationsClient } from "@twilio/conversations"
import NotificationService from './NotificationService';
import PushNotification from "react-native-push-notification"

const useAppMessageNotification = () => {
    const totalUnReadMessagesRef = useRef(0)
    const conversationUnreadCounts = useRef({})
    const conversationClient = useRef(null)
    /*const deviceToken = useRef(null)
    const conversationSID = useRef(null)*/
    const [deviceToken, setDeviceToken] = useState(null)
    const [conversationSID, setConversationSID] = useState(null)
    const userEmailRef = useRef(null)

    const twilioConversationClientOnConversationUpdate = useCallback(async (conversation, updateReasons) => {
        let firstUpdateReason = ''
        if (updateReasons.length > 0) {
            firstUpdateReason = updateReasons[0]
        }
			
        if (firstUpdateReason !== 'lastReadMessageIndex') {
            const latestMessagr = await conversation?.getMessages(1)
            const authorParticipant = await latestMessagr.items[0].getParticipant()
            if (authorParticipant.identity !== userEmailRef.current) {
                let total = totalUnReadMessagesRef.current
                const withUnRead = await conversation.getUnreadMessagesCount()
                total -= conversationUnreadCounts.current[conversation.sid] || 0
                total += withUnRead
                totalUnReadMessagesRef.current = total
                console.log("Updating Badge Count:", total)
            }
        }
    }, [conversationSID])

    useEffect(() => {
        if (conversationClient.current && conversationSID) {
            conversationClient.current.getConversationBySid(conversationSID)
                .then(conversation => {
                    twilioConversationClientOnConversationUpdate(conversation, ['lastReadMessageIndex'])
                })
                .catch(error => {
                    console.error("Error fetching conversation:", error)
                })
        }
    }, [twilioConversationClientOnConversationUpdate])

    useEffect(() => {
        const twilioConversationClientOnInit = async () => {
            if (conversationClient.current){
                let totalUnReadMessages = 0
                const conversationList = await conversationClient.current.getSubscribedConversations()
                while(1){
                    for (let i = 0; i < conversationList.items.length; i++) {
                        const item = conversationList.items[i]
                        const withUnRead = await item.getUnreadMessagesCount()
                        conversationUnreadCounts.current[item.sid] = withUnRead
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
                n.badgeCountUpdateOnlyNotif()
                PushNotification.setApplicationIconBadgeNumber(totalUnReadMessages)
                conversationClient.current.on("conversationUpdated", twilioConversationClientOnConversationUpdate)
            }        
        }
        
        if (deviceToken) {
            const userSubscribedConv = new ConversationsClient(deviceToken)
            conversationClient.current = userSubscribedConv
            userSubscribedConv.on("initialized", twilioConversationClientOnInit)
        }

        return () => {
            if (conversationClient.current) {
                conversationClient.current.off("initialized", twilioConversationClientOnInit)
                conversationClient.current.off("conversationUpdated", twilioConversationClientOnConversationUpdate)
            }
        }
    }, [deviceToken])

    const pushUnReaMessagesCountNotificationOnLogin = (dt, ue) => {
        //deviceToken.current = deviceToken
        setDeviceToken(dt)
        userEmailRef.current = ue
    }

    const pushUnReaMessagesCountNotificationOnConversationUpdate = (conversationSID) => {
        setConversationSID(deviceToken)
        const n = new NotificationService()
        n.localNotif()
        PushNotification.setApplicationIconBadgeNumber(totalUnReadMessagesRef.current)
    }

    return {pushUnReaMessagesCountNotificationOnLogin
        , pushUnReaMessagesCountNotificationOnConversationUpdate};
}

export default useAppMessageNotification;