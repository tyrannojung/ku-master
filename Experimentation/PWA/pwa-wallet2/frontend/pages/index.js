import { useEffect, useState } from 'react'
import Head from 'next/head'

const base64ToUint8Array = base64 => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const Index = () => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub)
            setIsSubscribed(true)
          }
        })
        setRegistration(reg)
      })
    }
  }, [])

  const subscribeButtonOnClick = async event => {
    event.preventDefault()
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
    })

    // TODO: you should call your API to save subscription data on server in order to send web push notification from server
    setSubscription(sub)
    setIsSubscribed(true)
    console.log('web push subscribed!')
    console.log(sub)
  }

  const unsubscribeButtonOnClick = async event => {
    event.preventDefault()
    await subscription.unsubscribe()
    // TODO: you should call your API to delete or invalidate subscription data on server
    setSubscription(null)
    setIsSubscribed(false)
    console.log('web push unsubscribed!')
  }

  const sendNotificationButtonOnClick = async event => {
    event.preventDefault()
    if (subscription == null) {
      console.error('web push not subscribed')
      return
    }
    console.log("subscription===", subscription)
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription
      })
    })
  }

  const sendMessageButtonOnClick = async () => {
    //const message = "Your predefined message or a message from user input";
    //console.log('h1?')
    //window.workbox.messageSW({command: 'log', message: 'hello world'})
    const subscription = {
      "endpoint": "https://fcm.googleapis.com/fcm/send/eqCfzlBUDS8:APA91bGw244UGwvHyZVFp6u98hxaU6oKrKDAtVFt5onMwp9mNc307rR7vN6aE07htQ2jbsTO-1k3mZ5W2yA_dWaGIeZxEA2knP1uMsgkxKocoG8FEC6RyK0LFLOhF_3mkWrQGotbn_iu",
      "expirationTime": null,
      "keys": {
          "p256dh": "BHoIbx-X3yhtBLHoaskTQDXxv3dIr6PHXiLF_7fRVbtld3ckPJPMSZx1lOU4iPiJb3C_7RJxSzPebuyZ08CnBY0",
          "auth": "AhCpQnROZuQpqwiW4XAQZw"
      }
  }
    // cors가 문제인가..?
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription
      })
    
    })
  }

  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>Next.js + PWA = AWESOME!</h1>
      <button onClick={subscribeButtonOnClick} disabled={isSubscribed}>
        Subscribe
      </button>
      <button onClick={unsubscribeButtonOnClick} disabled={!isSubscribed}>
        Unsubscribe
      </button>
      <button onClick={sendNotificationButtonOnClick} disabled={!isSubscribed}>
        Send Notification
      </button>
      {/* New button to send a message */}
      <button onClick={sendMessageButtonOnClick}>
        Send Message
      </button>
    </>
  )
}

export default Index
