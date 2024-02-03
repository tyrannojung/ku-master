import { useEffect, useState } from 'react'
import { ethers } from 'ethers';

import Head from 'next/head'

const transaction = {
  from: "0x84207aCCB87EC578Bef5f836aeC875979C1ABA85",
  to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  value: ethers.utils.parseEther("0"),
  data: "0x68656c6c6f"
};

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
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    // 컴포넌트 마운트 시 기존 세션 확인
    const session = localStorage.getItem('isAuthenticated');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignup = async () => {
    setPassword("12345")
    const signupPassword = password
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const encryptedJsonKey = await wallet.encrypt(signupPassword);
    localStorage.setItem('encryptedPrivateKey', encryptedJsonKey);
    localStorage.setItem('isAuthenticated', 'true');
    alert('Account created successfully. Your private key has been encrypted and stored securely.');
  };

  const handleLogin = async () => {
    // Retrieve the encrypted private key from localStorage
    const encryptedJsonKey = localStorage.getItem('encryptedPrivateKey');
  
    if (!encryptedJsonKey) {
      alert('No account found. Please sign up.');
      return;
    }
  
    try {
      // Decrypt the private key using the user's login password
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJsonKey, password);
      const publicKey = wallet.publicKey;
      const privateKey = wallet.privateKey;
      
      // Set isAuthenticated and display the private key
      
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      alert(`Login successful. Your public key is: ${publicKey} Your private key is: ${privateKey}`);
      sessionStorage.setItem('privateKey', privateKey)
      alert(sessionStorage.getItem('privateKey'))

    } catch (error) {
      console.log(error)
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      alert('Failed to login. Incorrect password or account does not exist.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // localStorage에서 세션 제거
    sessionStorage.removeItem('privateKey');
  };


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

  const checkLogin = async event => {
    alert(sessionStorage.getItem('privateKey'))
    
  }

  const sendNotificationButtonOnClick = async event => {
    event.preventDefault()
    if (subscription == null) {
      console.error('web push not subscribed')
      return
    }
    console.log("subscription===", subscription)
    const dataArray = [subscription, transaction]; 
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        dataArray
      )
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
    const dataArray = [subscription, transaction]; 
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        dataArray
      )
    
    })
  }

  const sendMessageButtonOnClickA = async () => {
    console.log('h1?')
    window.workbox.messageSW({command: 'log', privateKey: sessionStorage.getItem('privateKey')})
  }

  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>Next.js + PWA = AWESOME!</h1>


      {!isAuthenticated ? (
        <>
          <button onClick={handleSignup}>회원 가입</button>
          <button onClick={handleLogin}>로그인</button>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={checkLogin}>로그인 정보 확인</button>
        </>
      )}

      
      <br/>
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
      <button onClick={sendMessageButtonOnClickA}>
        Send Message2
      </button>
    </>
  )
}

export default Index
