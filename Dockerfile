# 베이스 이미지로 Node.js 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 프로덕션을 위한 정적 파일 서버 설치
RUN npm install -g serve

# 3002 포트 노출
EXPOSE 3002

# 애플리케이션 실행
CMD ["serve", "-s", "build", "-l", "3002"]