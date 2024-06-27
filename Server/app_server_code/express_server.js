
// express 설정
const express = require('express')
const app = express()
const port = 3010

// 해시 암호화 전용 모듈 -> PW 암호화 하기 위함
const bcrypt = require('bcrypt')

const multer = require('multer')	// multer import 파일을 다루는 모듈
// const upload = multer({ dest: 'uploads'}); // multer를 이용하여 이미지 폴더 설정

// 이미지 저장위치와 이름을 재정의 하는 코드 -> multer filename 콜백 함수를 override해서 이용
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {

      // 전달 받은 이름 그대로 저장	  
      cb(null, file.originalname)

	console.log('확장자 : '+file.mimetype)
  }

})

const upload = multer({ storage: storage  }); // storage 변수로 파일저장 위치, 이름 설정

app.use(express.json()); // JSON 형식 데이터 파싱
app.use(express.urlencoded({ extended: true })); // 일반 폼 데이터 파싱

// 몽구스 설정
const mongoose = require('mongoose')

async function connectDB () {

await mongoose.connect('mongodb://127.0.0.1:27017/my_app_db');
console.log('db 연결성공')
}

connectDB() // db 연결하기

// 0. board collection 만드는 과정
// 1. board Schema 정의하기
const boardSchema = new mongoose.Schema ({
	title: String,
	price: Number,
	description: String,
	imageName: String,
	userId: String
})
// 2. board Model 생성하기
const boardModel = mongoose.model('boards', boardSchema)

// 0. 계정 collection 만드는 과
// 1. 계정 Schema 정의하기
const accountSchema = new mongoose.Schema ({
	email: String,
	password: String
})
// 2. 계정 Model 생성하기
const accountModel = mongoose.model('account', accountSchema)



app.get('/', (req, res) => {
  res.send('앱 서버 홈화면')
})

// 서버 포트 열기
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// 데이터를 DB에 저장하기 위한 테스트 페이지
app.get('/upload_image', async (req, res) => {
//  res.sendfile(__dirname + '/home/Want_It_Project/app_server/dir_for_code/real_code/upload_image.html')
  res.sendfile('upload_image.html')	

});


// 게시판 생성
app.post("/CreateBoard", upload.single('image'),  async (req, res) => { // 이미지 저장

	console.log('게시판 생성')
        console.log('이미지 생성')
	
	// 게시판 DB에 저장
	try {
		boardModel.create ({
			 title: req.body.title.replace(/\"/g, ''),
 		         price: req.body.price,
       			 description: req.body.description.replace(/\"/g, ''),
       			 imageName: req.body.imageName.replace(/\"/g, ''),
			 userId: req.body.userId.replace(/\"/g, '')
		});

	        console.log('테스트 : '+req.body.title.replace(/\"/g, ''))

	} catch(e) {
                console.log('게시판 생성 실패 : '+req.body.title)
	}

});

// 게시판 읽기
app.get("/ReadBoard", async (req, res) => {
	console.log('게시판 읽기')

	 // 게시판 DB읽기
        try {
		res.send(await boardModel.find().sort({_id: -1}));
		
		console.log('게시판 DB : '+await boardModel.find().sort({_id: -1}));


        } catch(e) {
                console.log('게시판 읽기 실패 : ')
        }

});

// 내 게시글 수정
app.put("/UpdateBoard", async (req, res) => {
	console.log("내 게시글 수정")
	


});

// 내 게시글 삭제 
app.delete("/DeleteBoard", async (req, res) => {
	console.log("내 게시글 삭제")

	// 내 게시글 데이터 DB에서 삭제하기 -> 일단 DB만 삭제함, 이미지도 별도로 삭제해야한다
	let boardId = req.query.boardId // client에서 query로 준 boardId 데이터
	await boardModel.findByIdAndDelete(boardId) // DB에서 삭제

	res.send();

	console.log("Data = "+boardId)



});

// 내 게시글 읽기
app.get("/ReadMyBoard", async (req, res) => {
	 console.log("내 게시글 읽기")
	 
	// 내 게시글 DB에서 읽기
        try {
	// 클라이언트에서get으로 준 userId
		let userId = req.query.userId
		// userId로 db에서 해당하는 데이터 보내주기
		res.send(await boardModel.find({userId: userId}).sort({_id: -1}));
	

		console.log('내 게시판 userid: ')


		console.log('내 게시글 data : '+await boardModel.find({userId: userId}).sort({_id: -1}) )


        } catch(e) {
                console.log('내 게시판 읽기 실패 : '+e)
        }
});

// 카카오 로그인
app.get("/KakaoLogin", async (req, res) => {
	console.log("카카오 로그인 콜백")
})

// 이메일 회원가입
app.post("/EmailSignUp", async (req, res)  => {

	console.log("이메일 회원가입")

	// 계정 DB에 저장
        try {	
		// PW 암호화
		const saltRounds = 10;	
		let password = req.body.password.replace(/\"/g, '') // client에서 준 pw
		console.log("해시전 : "+password)

		// pw 해시 암호화
		password = await bcrypt.hash(password, saltRounds)
		console.log("해시후 : "+password)

		// email과 암호화한 pw DB에 넣어주
                accountModel.create ({
                         email: req.body.email.replace(/\"/g, ''),
                         password: password,
                });

                console.log('테스트 : '+req.body.email.replace(/\"/g, ''))

        } catch(e) {
                console.log('게시판 생성 실패 : '+req.body.email)
        }

})

// 이메일 로그인
app.post("/EmailLogin", async (req, res) => {
	console.log("이메일 로그인")

	// 이메일과 비밀번호 DB에서 인증하기
	try {	
		// 클라이언트에서 받은 데이터
		let clientEmail = req.body.email.replace(/\"/g, '')
		let clientPW = req.body.password

		// 이메일로 DB 계정 데이터 가져오기	
		let accountData = await accountModel.findOne({email: clientEmail})	

		// DB데이터를 담을 변수
		let dbEmail = "email"
		let dbPW = "pw"
		
		// 이메일이 DB에 없을 때
		if (accountData == null) {
			console.log("이메일 없음")		
		}else {
		// 이메일이 DB에 있을 때 -> 변수에 데이터 넣어주기
			dbEmail = accountData.email
			dbPW = accountData.password
		}
		
		// pw를 DB와 비교해기 -> 일치하면 true, 아니면 false
		// email과 pw가 맞을 때
		if (await bcrypt.compare(clientPW, dbPW)) {
			 const response = [{
                                loginState: "true",
				email: dbEmail,
				userId: accountData._id
                         }];
			console.log('로그인 성공')
			console.log('Json : '+res.json(response))
			console.log('로그인 전달 데이터'+accountData._id)
		
		}else {
		// email과 pw가 틀릴 때
			 const response = [{
				loginState: "false"
			 }];
			console.log('로그인 실패')
			console.log('Json : '+res.json(response))
		}

		console.log("email : "+ clientEmail+" = "+dbEmail )
		console.log("PW : "+ clientPW+" = "+dbPW )


	} catch(e) {
		console.log('로그인 에러 : '+e)
	}
})








			
