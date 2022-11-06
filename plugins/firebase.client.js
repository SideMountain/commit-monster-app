import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import 'firebase/messaging'

console.log('firebase.ts', firebase.apps.length)

const firebaseConfig = {
  apiKey: $config.firebase.apiKey,
  authDomain: $config.firebase.authDomain,
  projectId: $config.firebase.projectId,
  storageBucket: $config.firebase.storageBucket,
  messagingSenderId: $config.firebase.messagingSenderId,
  appId: $config.firebase.appId,
  measurementId: $config.firebase.measurementId,
}

if (!firebase.apps.length) {
  // init firebase
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  console.log(analytics)

  // check Push API
  const isSupported = firebase.messaging.isSupported()

  const publicVapidKey =
    'BGimt4jcD8giMnnniV88H3-PpQ-qRzLl__IWVI0ZCAH08oaF1Rx3rbtH4SbLXB7aqEa0dB9FmJ8XnPXHDyUBmHo'
  if (isSupported) {
    ;(async () => {
      const messaging = firebase.messaging()
      messaging.usePublicVapidKey(publicVapidKey)

      // @nuxtjs/pwaが生成する sw.js を指定する
      await navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          messaging.useServiceWorker(registration)
          console.log('Registration: ', registration)
        })
        .catch((err) => console.error(err))

      await messaging
        .getToken()
        .then((token) => console.log('token: ', token))
        .catch((error) =>
          console.log('An error occurred while retrieving token: ', error)
        )
      messaging.onTokenRefresh(async (_) => {
        await messaging
          .getToken()
          .then((token) => console.log('token: ', token))
          .catch((error) =>
            console.log('An error occurred while retrieving token: ', error)
          )
      })
      messaging.onMessage((payload) => {
        console.log('event: onMessage')
        console.log('    ', payload)
      })
    })()
  }
}
