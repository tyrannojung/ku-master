'use strict'
import { ethers } from 'ethers';

// const providerUrl = 'https://goerli.infura.io/v3/4c79c22d05294f9f81fbe2501462ac22';
// const provider = new ethers.providers.JsonRpcProvider(providerUrl);
// const wallet = new ethers.Wallet(testprivateKey, provider);


let privateKey = ""
let timer
let timerId
let transaction


const startTimer = async () => {
  timer = async () => {
    return new Promise(resolve => { // Promise를 반환
      timerId = setTimeout(() => {
        console.log("5분 후 실행됩니다.");
        // 5분 딜레이 후 실행할 코드를 여기에 추가
        resolve(); // Promise를 해결하여 완료를 알림
      }, 300000); // 5분 = 300,000 밀리초
      return timerId; // timerId를 반환
    }); 
  };
  timerId = await timer();
}

// listen to message event from window
self.addEventListener('message', function (event) {
  //==================현재 로그인 느낌=====================

  console.log("hi??44444")
  // type을 추가 한다.

  console.log(event?.data);
  privateKey = event?.data.privateKey;
  
  event.waitUntil(startTimer().then(() => {
    console.log("타이머가 완료되었습니다. 222");
  }));

});


self.addEventListener('push', function (event) {
  let data = JSON.parse(event.data.text())
  // type 을 나눠서 처리한다.
  let type = data.type
  transaction = data.transaction
  console.log("=======push event========")
  console.log(transaction)
  console.log(type)
  console.log("=======push event end========")
  switch (type) {
    case "push" : {
      event.waitUntil(
        registration.showNotification("트랜잭션 서명", {
          body: `트랜잭션을 서명하시겠습니까?`,
          icon: '/icons/icon-192x192.png',
          requireInteraction: true, // 사용자 상호작용이 있을 때까지 알림 유지
          actions: [
            { action: 'explore', title: '서명하기', icon: '/icons/push/explore-icon.png' },
            { action: 'close', title: '취소', icon: '/icons/push/close-icon.png' }
          ]
        })
      )
      break
    }

    case "connect" : {
      console.log("다른 동작을 추가시킨다.")
      break
    }

  }

})

self.addEventListener('notificationclick', async function (event) {
  console.log("========push 클릭 동적 동작 이벤트 ======")
  switch(event.action) {
    case "close":
      event.notification.close(); 
      return;
    case "explore":
      console.log("서명하기")
      console.log(transaction)
        // const tx = await wallet.sendTransaction(testtransaction);
        // const receipt = await tx.wait();
        // console.log('Transaction receipt:', receipt);

      event.notification.close();
      return;
  }

  console.log("site로 이동하기")
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      console.log("clientList ===")
      console.log(clientList)
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return clients.openWindow('/')
    })
  )
})
