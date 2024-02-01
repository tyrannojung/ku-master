self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text())
  event.waitUntil(
    registration.showNotification(data.title, {
      body: data.message,
      icon: '/icons/icon-192x192.png',
      requireInteraction: true, // 사용자 상호작용이 있을 때까지 알림 유지
      actions: [
        { action: 'explore', title: '서명하기', icon: '/icons/push/explore-icon.png' },
        { action: 'close', title: '취소', icon: '/icons/push/close-icon.png' }
      ]
    })
  )
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
