
// 두개의 서버 모듈 불러옴 express, http
const express = require('express');
const { createServer } = require('node:http');

const { join } = require('node:path');          // path 모듈 사용
const { Server } = require('socket.io');        // socket.io 모듈 사용


// app에 express 서버 생성 후 nodejs서버에 app을 넣음
const app = express();
const server = createServer(app);
const io  = new Server(server); // socket.io 객체 생성, 서버 변수인 server를 넣어준다

// express를 사용하여 라우팅 같은 걸 쉽게하고 http모듈로는 listen만 하는것 같다
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// 라우팅해서 채팅 html을 보여주기
app.get( '/chat', (req, res) => {
  res.sendFile(join(__dirname, 'socket_io2.html'));  // sendFile, join, __dirname 사용
});

// 소캣 통신 코드
// 연결 됬을 때 
io.on ('connection', (socket) => {
  console.log('a user connected')

  // 연결 성공 했을 때


  // 연결 종료 했을 때
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

 // 메세지 보여주는 로그
  socket.on ('chat message', (msg) => {
    console.log('message : ' + msg);
    // 클라리언트 소켓에 보낸 메세지 뿌려주기     
    io.emit('chat message', msg);

  }
  );

});


// 3001 포트 열기
server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
	
});
