import styles from '../styles/Home.module.css';
import base64url from 'base64url';

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
    
    let regCredential;
    
    const saltbase = new Array(32).fill(1)
    
    // salt 저장 1
    localStorage.setItem('salt', saltbase);
    
    regCredential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([1, 2, 3, 4]),
        rp: {
          name: "localhost PRF 데모",
          id: "localhost",
        },
        user: {
          id: new Uint8Array([5, 6, 7, 8]),
          name: "tyrannojung",
          displayName: "tyrannojung",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          userVerification: "required",
          residentKey: 'required',
          authenticatorAttachment: 'cross-platform',
        },
        extensions: {
          prf: {
            eval: {
              first: new Uint8Array(localStorage.getItem('salt')).buffer,
            },
          },
        },
      },
    });
    
    console.log("regCredential ===", regCredential)
    
    // 인증정보 저장 2
    localStorage.setItem('regCredential', JSON.stringify(regCredential));

    const getRegCredential = JSON.parse(localStorage.getItem('regCredential'));
    
    // 허용 안되면 뒤로 가기
    const extensionResults = regCredential.getClientExtensionResults();        
    const prfSupported = !!(
      extensionResults.prf && extensionResults.prf.enabled
    );
    //////////////

    console.log(`PRF 지원됨: ${prfSupported}`);

    const auth1Credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array([9, 0, 1, 2]), // 예시 값
        allowCredentials: [
          {
            id: base64url.toBuffer(getRegCredential.rawId),
            transports: getRegCredential.response.transports,
            type: "public-key",
          },
        ],
        rpId: "localhost",
        userVerification: "required",
        extensions: {
          prf: {
            eval: {
              first: new Uint8Array(localStorage.getItem('salt')).buffer,
            },
          },
        },
      },
    });

    const auth1ExtensionResults = auth1Credential.getClientExtensionResults();
    console.log("인증 확장 결과:", auth1ExtensionResults);
    
    const inputKeyMaterial = new Uint8Array(
      auth1ExtensionResults.prf.results.first
    );
    
    const keyDerivationKey = await crypto.subtle.importKey(
      "raw",
      inputKeyMaterial,
      "HKDF",
      false,
      ["deriveKey"]
    );

    //정보
    const label = "pwa_symmetric_key";
    const info = new TextEncoder().encode(label);
    //아무 요소가 포함되지 않은 빈배열
    const salt = new Uint8Array();

    const encryptionKey = await crypto.subtle.deriveKey(
      { name: "HKDF", info, salt, hash: "SHA-256" },
      keyDerivationKey,
      { name: "AES-GCM", length: 256 },
      // 재생성 가능하기 때문에 내보낼 필요 없음
      false,
      ["encrypt", "decrypt"]
    );
    
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    // nonce to string
    const nonceBase64 = btoa(String.fromCharCode.apply(null, nonce));
    
    // 인증정보 저장 3
    localStorage.setItem('iv', nonceBase64);

    // const nonceBase64test = localStorage.getItem('iv');
    // console.log("nonce====", nonceBase64test)
    // // nonce to binary data
    // const nonceArray = Uint8Array.from(atob(nonceBase64test), c => c.charCodeAt(0));


    // example
    // const encrypted = await crypto.subtle.encrypt(
    //   { name: "AES-GCM", iv: nonce },
    //   encryptionKey,
    //   new TextEncoder().encode("hello readers 🥳")
    // );

    // const decrypted = await crypto.subtle.decrypt(
    //   { name: "AES-GCM", iv: nonce },
    //   encryptionKey,
    //   encrypted
    // );

    // const decodedMessage = new TextDecoder().decode(decrypted);
    // console.log(`디코딩된 메시지: "${decodedMessage}"`);
    
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      encryptionKey,
      new TextEncoder().encode(privateKey)
    );

    console.log(encrypted)
    const encryptedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
    localStorage.setItem('data', encryptedBase64);

    // 복호화
    // const encryptedBase64test = localStorage.getItem('data');
    // const encryptedArray = Uint8Array.from(atob(encryptedBase64test), c => c.charCodeAt(0));
    // const decrypted = await crypto.subtle.decrypt(
    //   { name: "AES-GCM", iv: nonce },
    //   encryptionKey,
    //   encryptedArray
    // );
    // console.log(new TextDecoder().decode(decrypted))

    // 유저 패스워드 (수정2)
    alert('Account created successfully. Your private key has been encrypted and stored securely.');

    //구독 진행
    event.preventDefault()
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
    })

    console.log(sub)
    setSubscription(sub)

    alert('web push subscribed!')
  };

  const handleLogin = async () => {
    //Login
    //패스워드 수정할것.
    const getRegCredential = JSON.parse(localStorage.getItem('regCredential'));
    const auth1Credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array([9, 0, 1, 2]), // 예시 값
        allowCredentials: [
          {
            id: base64url.toBuffer(getRegCredential.rawId),
            transports: getRegCredential.response.transports,
            type: "public-key",
          },
        ],
        rpId: "localhost",
        userVerification: "required",
        extensions: {
          prf: {
            eval: {
              first: new Uint8Array(localStorage.getItem('salt')).buffer,
            },
          },
        },
      },
    });
    const auth1ExtensionResults = auth1Credential.getClientExtensionResults();
    console.log("인증 확장 결과:", auth1ExtensionResults);
    
    const inputKeyMaterial = new Uint8Array(
      auth1ExtensionResults.prf.results.first
    );
    
    const keyDerivationKey = await crypto.subtle.importKey(
      "raw",
      inputKeyMaterial,
      "HKDF",
      false,
      ["deriveKey"]
    );

    //정보
    const label = "pwa_symmetric_key";
    const info = new TextEncoder().encode(label);
    //아무 요소가 포함되지 않은 빈배열
    const salt = new Uint8Array();

    const encryptionKey = await crypto.subtle.deriveKey(
      { name: "HKDF", info, salt, hash: "SHA-256" },
      keyDerivationKey,
      { name: "AES-GCM", length: 256 },
      // 재생성 가능하기 때문에 내보낼 필요 없음
      false,
      ["encrypt", "decrypt"]
    );

    const nonceBase64 = localStorage.getItem('iv');
    console.log("nonce====", nonceBase64)
    // nonce to binary data
    const nonce = Uint8Array.from(atob(nonceBase64), c => c.charCodeAt(0));
    
    const encryptedBase64 = localStorage.getItem('data');
    console.log(encryptedBase64)
    const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      encryptionKey,
      encrypted
    );

    let private_key = new TextDecoder().decode(decrypted)
    private_key = `0x${private_key}`
    console.log(private_key)

    // `sub` 객체를 쿼리 스트링에 적합한 형태로 변환
    const subAsString = encodeURIComponent(JSON.stringify(subscription));
    
    // 쿼리 스트링을 구성
    const queryString = `pubk=${private_key}&sub=${subAsString}`;
    
    // 5분 연결
    window.workbox.messageSW({command: 'log', privateKey: private_key})
    
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
