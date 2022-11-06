import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import 'firebase/messaging'

console.log('firebase.ts', firebase.apps.length)

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

if (!firebase.apps.length) {
  // init firebase
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)

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
