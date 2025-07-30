import UIKit
import UserNotifications
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    // Initialize Firebase
    FirebaseApp.configure()
    
    // Initialize AppCenter
    AppCenterReactNative.register()
    AppCenterReactNativeCrashes.register()

    // Set UNUserNotificationCenter delegate
    UNUserNotificationCenter.current().delegate = self

    // Setup React Native Factory
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "limblab",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - Push Notification Handling

  // func application(_ application: UIApplication,
  //                  didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
  //   RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  // }

  // func application(_ application: UIApplication,
  //                  didFailToRegisterForRemoteNotificationsWithError error: Error) {
  //   RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(error)
  // }

  func application(_ application: UIApplication,
                   didReceiveRemoteNotification userInfo: [AnyHashable : Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .badge, .sound])
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    RNCPushNotificationIOS.didReceive(response)
    completionHandler()
  }
}

// MARK: - React Native Delegate

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  // Disable faulty third-party Fabric components registration
  @objc func thirdPartyFabricComponents() -> [String: Any] {
    return [:]
  }

  override func sourceURL(for bridge: RCTBridge!) -> URL! {
    return self.bundleURL()
  }

  override func bundleURL() -> URL! {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

