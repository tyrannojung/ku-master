const Message = (req, res) =>  {
    if (req.method === 'POST') {
    // POST 요청에서 메시지 데이터 추출
        const { message } = req.body;
    
        // 메시지 처리 로직 추가
        console.log(`Received message: ${message}`);
     
      // 성공 응답 반환
      res.status(200).json({ message: 'Message processed successfully' });
    } else {
      // POST 요청이 아닌 경우 405 Method Not Allowed 응답 반환
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  export default Message