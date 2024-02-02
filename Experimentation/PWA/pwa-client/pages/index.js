const Home = () => {
  const handleClick = async () => {
    // 버튼을 클릭할 때 메시지를 보내는 로직을 추가
    const subscription = {
      "endpoint": "https://fcm.googleapis.com/fcm/send/eqCfzlBUDS8:APA91bGw244UGwvHyZVFp6u98hxaU6oKrKDAtVFt5onMwp9mNc307rR7vN6aE07htQ2jbsTO-1k3mZ5W2yA_dWaGIeZxEA2knP1uMsgkxKocoG8FEC6RyK0LFLOhF_3mkWrQGotbn_iu",
      "expirationTime": null,
      "keys": {
          "p256dh": "BHoIbx-X3yhtBLHoaskTQDXxv3dIr6PHXiLF_7fRVbtld3ckPJPMSZx1lOU4iPiJb3C_7RJxSzPebuyZ08CnBY0",
          "auth": "AhCpQnROZuQpqwiW4XAQZw"
      }
  }
    await fetch('http://localhost:3000/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription
      })
    
    })
  };

  return (
    <div>
      <h1>hi</h1>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
};

export default Home;