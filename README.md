# Retique
Retique, or REal-TIme QUEstion System, is an open source multi-purpose questioning system.  

Try it now: [https://retique.allenchou.cc](https://retique.allenchou.cc)  

## Usage
1. Create Room  
2. Share the link with other participants
3. Enjoy Retique!

## Screenshots
### Home
![Home](https://i.imgur.com/sycMIJY.png)

### Room
![Room](/client/public/screenshot.png)

### Create Room
![Create Room](https://i.imgur.com/zziLHZt.png)

## Installation
### Production
First clone the repo:  
```
git clone https://github.com/s3131212/retique.git
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

## LICENSE
MIT
