var express = require('express');
var cors = require('cors')
var db = require('./db');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('api');
});
router.get('/checkRoom', cors(), (req,res) => {
    if(! "abbr" in req.query){
        res.send("false");
        return;
    }

    db.queryRoombyAbbr(req.query.abbr).then(results => {
        if(results.length == 0){
            res.send("false");
        }else{
            res.send("true");
        }
    }).catch(err => {
        res.send("false");
    });

});

router.post('/createRoom', cors(), (req,res) => {
    if(! "name" in req.body || ! "abbr" in req.body || ! "pwd" in req.body){
        res.send("missing data");
        return;
    }
    db.queryRoombyAbbr(req.body.abbr).then(results => {
        if(results.length != 0){
            res.send("duplicate abbr");
        }else{
            db.createRoom(req.body.name, req.body.abbr, req.body.pwd).then(results => {
                res.send("true")
            }).catch(err => {
                res.send(err);
            });
        }
    }).catch(err => {
        res.send("false");
    });
});

router.post('/loginRoom', cors(), (req,res) => {
    if(! "roomid" in req.body || ! "password" in req.body){
        res.send("missing data");
        return;
    }
    db.getRoomPassword(req.body.roomid).then(results => {
        if(results.length == 0){
            res.send("room id error");
        }else if(results[0].password === req.body.password){
            if(typeof req.session.auth !== "object") req.session.auth = [];
            if(req.session.auth.indexOf(req.body.roomid) == -1) req.session.auth.push(req.body.roomid);
            res.send("true");
        }else{
            res.send("false");
        }
    }).catch(err => {
        console.log(err);
        res.send("false");
    });
});

router.get('/logoutRoom', cors(), (req,res) => {
    if(! "roomid" in req.query){
        res.send("roomid not set");
    }else if(typeof req.session.auth !== "object"){
        res.send("session missing");
    }else if(req.session.auth.indexOf(parseInt(req.query.roomid)) == -1){
        res.send("not logined");
    }else{
        req.session.auth.splice(req.session.auth.indexOf(req.query.roomid), 1);
        res.send("true");
    }
    
});

router.get('/getLoginedList',cors(), (req, res) => {
    if(typeof req.session.auth !== "object") req.session.auth = [];
    res.send(JSON.stringify(req.session.auth));
})

router.post('/deleteQuestion', cors(), (req,res) => {
    if(! "QuestionID" in req.body || ! "roomAbbr" in req.body){
        res.send("missing data");
        return;
    }
    if(typeof req.session.auth !== "object") req.session.auth = [];
    db.deleteQuestionByID(req.body.QuestionID, req.session.auth).then(results => {
        if(results.affectedRows == 0){
            res.send("false");
        }else{
            res.send("true");
            req.io.to(req.body.roomAbbr).emit("update");
        }
    }).catch(err => {
        console.log(err);
        res.send("false");
    });
});

module.exports = router;
