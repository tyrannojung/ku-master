import { useEffect, useState } from 'react'
import { ethers } from 'ethers';

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

  const handleSignup = async () => {
    
  };

  const handleLogin = async () => {

  
  };

  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>Next.js + PWA = AWESOME!</h1>
      <button onClick={handleSignup}>회원 가입</button>
      <button onClick={handleLogin}>로그인</button>

    </>
  )
}

export default Index
