import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import OneSignalFramework

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    FirebaseApp.configure()

    // 🔥 OneSignal Init
    OneSignal.initialize("a09e038e-638f-4d66-9946-fff45f453136", withLaunchOptions: launchOptions)

    OneSignal.Notifications.requestPermission({ accepted in
      print("User accepted notifications: \(accepted)")
    }, fallbackToSettings: true)
    
    // Explicitly register for remote notifications
    application.registerForRemoteNotifications()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "goldrate",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  // MARK: - Remote Notification Delegates
  
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
      print("✅ Successfully registered for remote notifications! Token: \(tokenString)")
      // OneSignal handles this automatically, but this verifies APNs is working.
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
      print("❌ Failed to register for remote notifications: \(error.localizedDescription)")
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
