const axios = require('axios')

require('dotenv').config()
// 이제 .env 파일의 환경변수를 process.env 객체를 통해 읽을 수 있게 된다.
const { API_END_POINT, API_KEY } = process.env

exports.handler = async function(event) {
  // options는 event의 body 부분에 들어있다.
  const options = JSON.parse(event.body)
  const { id = '', method, body } = options
  const { data } = await axios({
    url: `${API_END_POINT}${id}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-username': API_KEY
    },
    data: body
  })
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}