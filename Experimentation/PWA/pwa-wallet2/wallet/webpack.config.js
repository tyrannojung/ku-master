const path = require('path'); // path 모듈을 가져옵니다.
const webpack = require('webpack'); // webpack 모듈을 가져옵니다.

module.exports = {
    // 개발 모드로 설정합니다. 프로덕션 배포 시에는 'production'으로 변경하세요.
    mode: 'production',
  
    // 서비스 워커가 위치한 진입점 설정
    entry: './worker/service-worker.js',
  
    // 번들링된 결과물 설정
    output: {
      filename: 'index.js', // 결과물 파일 이름
      path: path.resolve(__dirname, 'worker'), // 결과물 경로
    },
  
    // 모듈 처리 방식 정의
    module: {
      rules: [
        {
          test: /\.js$/, // .js 확장자를 가진 파일에 대한 처리 규칙
          exclude: /node_modules/, // node_modules 폴더는 제외
          use: {
            loader: 'babel-loader', // Babel 로더를 사용
            options: {
              presets: ['@babel/preset-env'], // 최신 JavaScript 문법을 호환 가능한 코드로 변환
            },
          },
        },
        // 필요에 따라 추가 파일 처리 규칙을 여기에 포함할 수 있습니다.
      ],
    },
  
    // 웹팩이 빌드할 때 Node.js의 내장 모듈을 모방하는 것을 방지합니다.
    resolve: {
      fallback: {
        "http": false,
        "https": false,
        "crypto": false,
        "stream": false,
        "os": false,
      },
    },
  
    // 서비스 워커에서 'window' 객체는 사용할 수 없으므로, 'global' 객체를 'window'의 대체로 설정합니다.
    plugins: [
      new webpack.DefinePlugin({
        window: 'global',
      }),
    ],
  
    // 웹팩의 성능 힌트 비활성화 (선택 사항)
    performance: {
      hints: false,
    },
  };