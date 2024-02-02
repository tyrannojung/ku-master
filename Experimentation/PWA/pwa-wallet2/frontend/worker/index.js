'use strict'

let memory_password = ""
let timer
let timerId

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
  // HOW TO TEST THIS?
  // Run this in your browser console:
  // window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  // window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);
  let private_key = event?.data.privateKey
  console.log(private_key)
  memory_password = private_key;
  
  event.waitUntil(startTimer().then(() => {
    console.log("타이머가 완료되었습니다. 222");
  }));

});


self.addEventListener('push', function (event) {
  let data = JSON.parse(event.data.text())
  // type 을 나눠서 처리한다.
  let type = data.type
  console.log(type)
  switch (type) {
    case "push" : {
      event.waitUntil(
        registration.showNotification(data.title, {
          body: `${data.message} private key === ${memory_password}`,
          icon: '/icons/icon-192x192.png',
          requireInteraction: true, // 사용자 상호작용이 있을 때까지 알림 유지
          actions: [
            { action: 'explore', title: '서명하기', icon: '/icons/push/explore-icon.png' },
            { action: 'site', title: '사이트 이동', icon: '/icons/push/explore-icon.png' },
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

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
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
