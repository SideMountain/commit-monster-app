importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js')

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Firebaseの初期化
firebase.initializeApp(firebaseConfig)

// [START background_handler]
const isSupported = firebase.messaging.isSupported()
if (isSupported) {
  const showPushNotification = (datum, swRegistration) => {
    console.log('  Start showing a notification')
    const options = {
      title: datum.notification.title,
      body: datum.notification.body,
      icon: datum.notification.image,
      tag: datum.notification.tag,
      data: {
        destination: datum.data.destination,
      },
    }
    swRegistration
      .showNotification(datum.notification.title, options)
      .then((_) => {
        console.log('  options: ', options)
        console.log('  used-data: ', datum)
      })
      .catch((error) => console.error(error.messaging))
  }

  const setEventListeners = (sw) => {
    sw.addEventListener('install', (event) => {
      console.log('ServiceWorker event: ', event.type)
      sw.skipWaiting().then((_) => console.log('    skipped waiting.'))
    })

    sw.addEventListener('activate', (event) => {
      console.log('ServiceWorker event: ', event.type)
      event.waitUntil(
        sw.clients.claim().then((_) => console.log('    claimed.'))
      )
    })

    sw.addEventListener('push', (event) => {
      console.log('ServiceWorker event: ', event.type)
      try {
        const datum = JSON.parse(event.data.text())
        console.log('  event.data: ', datum)
        console.log('  sw.registration: ', sw.registration)
        showPushNotification(datum, sw.registration)
      } catch (error) {
        console.error(error.message)
      }
    })

    sw.addEventListener('notificationclick', async (event) => {
      console.log('ServiceWorker event: ', event.type)
      console.log('  ', event)
      event.notification.close()
      let destination = event.notification.data.destination
      if (event.notification.data.FCM_MSG) {
        destination = event.notification.data.FCM_MSG.data.destination
      }
      if (!destination) {
        return
      }

      await event.waitUntil(
        clients
          .matchAll()
          .then(async (clientList) => {
            console.log('  clientList:', clientList)
            let shouldOpen = true
            await Promise.all(
              clientList.map(async (client) => {
                if (client.url === destination && 'focus' in client) {
                  shouldOpen = false
                  return await client
                    .focus()
                    .then((_) => console.log('    client:', client.url))
                }
              })
            )
            if (shouldOpen && 'openWindow' in clients) {
              console.log('  destination: ', destination)
              await clients.openWindow(destination)
            }
            event.notification.close()
          })
          .catch((error) => console.error('  ', error.toString()))
      )
    })
  }

  setEventListeners(self)
  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler((payload) => {
    console.log('ServiceWorker event:  BackgroundMessage', payload)
  })

  console.log('Hello from ServiceWorker.')
}
