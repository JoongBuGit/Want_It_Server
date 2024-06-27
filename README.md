개발 환경 설치 목록
<br>　우분투 22버전
<br>　node 설치
<br>　Mongodb 설치
<br>　Let's Encrypt를 통해서 인증서 발급

Nginx를 리버스 프록시 서버로 두고 
<br>　Let's Encrypt를 적용해야 코드가 https가 적용되어 돌아간다

<br>
코드 파일 설명
<br>
    
    nginx.conf - 리버스 프록시 서버 설정 파일

    Server 
      socket_io2.html - 웹 채팅 html 파일
      socket_io_server.js - 웹 서버 js 파일
      app_server_code - 폴더
        express_server.js - 앱 서버 js 파일
        images - 업로드 된 이미지 저장 폴더
        
    
