# Retique
Retique, or REal-TIme QUEstion System, is an open source multi-purpose questioning system.  

Try it now: [https://retique.allenchou.cc](https://retique.allenchou.cc)  

## Usage


## Installation
### Production
First clone the repo:  
```
git clone https://github.com/s3131212/midterm_retique.git
cd midterm_retique
```

Then build the frontend:
```
cd client  # pwd = /path/to/repo/client
npm install
npm run build
``` 

Edit the database connection info:
```
cd ..  # pwd = /path/to/repo/
vim db.js
```
Make sure you have already import `db.sql`

Last, start the server:  
```
npm install
npm start
```
When no port is set in environment variable, port `80` will be used.

### Development
Start both backend server and React dev server.

To start backend server, use:
```
# pwd = /path/to/repo/
npm start
```

Before starting React dev server, change the `proxy` in `package.json` to backend server address.

Then start the React dev server:
```
cd client  # pwd = /path/to/repo/client
npm start
```

Now use `localhost:3000` (or the port React dev server used) to access Retique.  

## Packages Used
Frontend:
* React
* Moment & React-Moment
* SweetAlert & SweetAlert-React
* Socket.io
* Tocas UI

Backend:
* Express
* Express-session
* Express-CORS
* node-mysql
* Socket.io
* node-uuid

## My contribution
All code except the packages mentioned above.

## Reflection
這段用中文寫好了 XD  
會寫這個主要是因為之前活動和課堂用 slido 有一些不愉快的經驗，所以才想說趁這個機會自己寫個仿 slido 但更符合我所要使用的場景的提問系統。剛把架構想完時覺得應該不難，但實際寫下來也花了不少時間，踩了蠻多坑，像是處理時區或是資料同步等等的，總之各種被自己的 code 和爛架構雷到的事情。總之至少現在算是順利寫到能用了，也真的學了蠻多。