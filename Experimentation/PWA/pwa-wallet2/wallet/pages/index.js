import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const [subscription, setSubscription] = useState(null)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub)
          }
        })
        setRegistration(reg)
      })
    }
  }, [])

  const handleSignup = async event => {
    
    // 유저 설명 패스워드 (수정1)
    const password = "12345"
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    
    // 유저 패스워드 (수정2)
    const encryptedJsonKey = await wallet.encrypt(password);
    localStorage.setItem('encryptedPrivateKey', encryptedJsonKey);
    alert('Account created successfully. Your private key has been encrypted and stored securely.');
    
    //구독 진행
    event.preventDefault()
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
    })

    setSubscription(sub)
    alert('web push subscribed!')

  };

  const handleLogin = async () => {
    //Login
    //패스워드 수정할것.
    const password = "12345"
    const wallet = await ethers.Wallet.fromEncryptedJson(localStorage.getItem('encryptedPrivateKey'), password);

    // `sub` 객체를 쿼리 스트링에 적합한 형태로 변환
    const subAsString = encodeURIComponent(JSON.stringify(subscription));
    
    // 쿼리 스트링을 구성
    const queryString = `pubk=${wallet.publicKey}&sub=${subAsString}`;
    
    // 5분 연결
    window.workbox.messageSW({command: 'log', privateKey: wallet.privateKey})
    
    // index 페이지로 이동
    router.push(process.env.NEXT_PUBLIC_REDIRECT_URL + `?${queryString}`);

  };

  const unsubscribeButtonOnClick = async event => {
    event.preventDefault()
    await subscription.unsubscribe()
    // TODO: you should call your API to delete or invalidate subscription data on server
    setSubscription(null)
    alert('web push unsubscribed!')

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet Oauth Login</title>
      </Head>
      <img 
        src="/images/ontherinc.png" 
        alt="Company Logo" 
        className={styles.logo}
      />
      <h1 className={styles.title}>Oauth PWA Wallet</h1>
      <img 
          src="/images/ex.png" // 이미지 경로를 확인하세요.
          alt="Google 계정 로그인"
          className={styles.responsiveImage} // CSS 클래스를 적용합니다.
      />
      <div>
        <button 
          onClick={handleSignup} 
          className={`${styles.button} ${styles.signupButton}`}
        >
          회원 가입
        </button>
        <button 
          onClick={handleLogin} 
          className={`${styles.button} ${styles.loginButton}`}
        >
          EOA 로그인
        </button>
        <button 
          className={`${styles.button} ${styles.loginButton}`} disabled
        >
          SC 로그인(준비중)
        </button>
        <button 
          onClick={unsubscribeButtonOnClick} 
          className={`${styles.button} ${styles.unsubscribeButton}`}
        >
          초기화
        </button>
      </div>
    </div>
  )
}

export default Index
