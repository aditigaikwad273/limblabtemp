import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
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
    console.log('Registered with token:', token.token);
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
      //console.log("Background message recd for increment", remoteMessage)
      if (remoteMessage.priority > 0){
        const currentAppBadgeCount = await AsyncStorage.getItem("currentAppBadgeCount")
        currentAppBadgeCountInt = parseInt(currentAppBadgeCount)
        console.log("Backgroung Badgecount read", currentAppBadgeCountInt)
        n.cancelOnlyLastSilentNotif()
        n.badgeCountUpdateOnlyNotif()//update badge count only if any notification recd in foreground
        console.log("Backgroung Badgecount set to", currentAppBadgeCountInt + 1)
        PushNotification.setApplicationIconBadgeNumber(currentAppBadgeCountInt + 1)
        currentAppBadgeCountInt += 1
        await AsyncStorage.setItem("currentAppBadgeCount", currentAppBadgeCountInt.toString())
      }
    });


if (Platform.OS === "android") PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

AppRegistry.registerComponent(appName, () => App);
