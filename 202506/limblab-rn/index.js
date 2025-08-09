import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
    Platform,
    PermissionsAndroid
} from "react-native"

import NotificationService from './src/utils/NotificationService';
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const onRegister = async (token) => {
    await AsyncStorage.setItem('deviceToken', token.token)
}

const onNotif = (notification) => {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
}

new NotificationService(
    onRegister,
    onNotif,
);

if (Platform.OS === "android") PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

AppRegistry.registerComponent(appName, () => App);
