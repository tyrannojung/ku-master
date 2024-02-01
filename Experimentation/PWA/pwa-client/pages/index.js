const Home = () => {
  const handleClick = () => {
    // 버튼을 클릭할 때 메시지를 보내는 로직을 추가
    const message = 'Hello from A page!'; // 보낼 메시지 내용
    window.postMessage({ type: 'custom', data: message }, 'http://localhost:3000/');
  };

  return (
    <div>
      <h1>hi</h1>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
};

export default Home;