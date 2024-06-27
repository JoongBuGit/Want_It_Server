const express = require('express');
const multer = require('multer');
const app = express();
const port = 3010;

// 업로드 폴더 설정
const upload = multer({ dest: 'uploads/' });

app.use(express.json()); // JSON 형식 데이터 파싱
app.use(express.urlencoded({ extended: true })); // 일반 폼 데이터 파싱

// 파일 업로드 라우트
app.post('/upload_js', upload.single('myfile'), (req, res) => {

  // 업로드된 파일 정보는 req.file 객체에 담겨 있습니다.
  const fileName = req.file.filename;
  const originalName = req.file.originalname;
  const mimeType = req.file.mimetype;
  const size = req.file.size;

  console.log(`업로드된 파일: ${fileName}`);
  console.log(`원본 파일명: ${originalName}`);
  console.log(`MIME 타입: ${mimeType}`);
  console.log(`파일 크기: ${size} bytes`);

  // 업로드된 파일을 처리하는 로직 작성

  res.send({ message: '파일 업로드 성공' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});


// 데이터를 DB에 저장하기 위한 테스트 페이지
app.get('/upload_html', async (req, res) => {
  res.sendFile(__dirname + '/file.html')
});


// 이미지 확인용 html
app.get('/show_image_html', async (req, res) => {
  res.sendFile(__dirname + '/show_image.html')
});


// 이미지 서버용 코드
app.get('/image', async (req, res) => {
  res.sendFile(__dirname + '/images/1717832882745.jpg')
});




