const webPush = require('web-push')
import Cors from 'cors';

webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  )

const cors = Cors({
    methods: ['POST'], // 허용할 HTTP 메소드
    origin: 'http://localhost:3005', // 허용할 출처 지정
    // origin: ['http://localhost:3005', 'https://example.com'], // 여러 출처를 허용할 경우 배열 사용
});

// 미들웨어를 실행하는 도우미 함수
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

const Message = async (req, res) =>  {
    
    // CORS 미들웨어 실행
    await runMiddleware(req, res, cors);

    if (req.method == 'POST') {
        const { subscription } = req.body
    
        webPush
          .sendNotification(
            subscription,
            JSON.stringify({ type: 'connect' })
          )
          .then(response => {
            res.writeHead(response.statusCode, response.headers).end(response.body)
          })
          .catch(err => {
            if ('statusCode' in err) {
              res.writeHead(err.statusCode, err.headers).end(err.body)
            } else {
              console.error(err)
              res.statusCode = 500
              res.end()
            }
          })
      } else {
        res.statusCode = 405
        res.end()
      }
  }

  export default Message