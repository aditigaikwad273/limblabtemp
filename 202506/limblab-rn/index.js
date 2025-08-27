import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
  Platform,
  PermissionsAndroid
} from "react-native"

import NotificationService from './src/utils/NotificationService';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification from "react-native-push-notification"
import AsyncStorage from "@react-native-async-storage/async-storage"
import messaging from '@react-native-firebase/messaging';

 const onRegister = async (token) => {
    await AsyncStorage.setItem('deviceToken', token.token)
  }
/*
  const onNotif = (notification) => {
    console.log('Notification received:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }*/

  const n = new NotificationService(
      onRegister
    );

  messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage.priority > 0){
        const lastMessageCreatedAt = await AsyncStorage.getItem("lastMessageCreatedAt")
        const currentAppBadgeCount = await AsyncStorage.getItem("currentAppBadgeCount")
        let lastMessageCreatedAtDt = null
        if (lastMessageCreatedAt){
          lastMessageCreatedAtDt = new Date(lastMessageCreatedAt)
        }
        const remoteMessageDt = new Date(remoteMessage.data.messageCreatedAt)
        if (lastMessageCreatedAt == null || remoteMessageDt > lastMessageCreatedAtDt){
          let currentAppBadgeCountInt = parseInt(currentAppBadgeCount)
          n.cancelOnlyLastSilentNotif()
          n.badgeCountUpdateOnlyNotif()//update badge count only if any notification recd in foreground
          PushNotification.setApplicationIconBadgeNumber(currentAppBadgeCountInt + 1)
          currentAppBadgeCountInt += 1
          await AsyncStorage.setItem("currentAppBadgeCount", currentAppBadgeCountInt.toString())
        }
      }
    });

if (Platform.OS === "android") PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

AppRegistry.registerComponent(appName, () => App);
