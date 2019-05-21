const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: '',
    password: '',
    database: 'retique',
    dateStrings : true
});

function queryRoombyAbbr(abbr){
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM rooms WHERE abbr = ? ;', abbr,(err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function queryQuestionListbyRoomID(roomid){
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM questions WHERE roomid = ? ;', roomid,(err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function insertQuestiontoRoom(question, author, replyid, roomid){
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO `questions` SET ?;", { roomid: roomid, content: question, author: author, replyid: replyid },(err, result) => {
            if(err) reject(err)
            else resolve(result)
        });
    });
}

function updateQuestionLike(questionid, isAdd){
    return new Promise((resolve, reject) => {
        if(isAdd){
            pool.query("UPDATE questions SET `like` = `like` + 1 WHERE id = ?", questionid,(err, result) => {
                if(err) reject(err)
                else resolve(result)
            });
        }else{
            pool.query("UPDATE questions SET `like` = GREATEST(`like`-1, 0) WHERE id = ?", questionid,(err, result) => {
                if(err) reject(err)
                else resolve(result)
            });
        }
    });
}

function createRoom(name, abbr, pwd){
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO `rooms` SET ?;", { name: name, abbr: abbr, password: pwd },(err, result) => {
            if(err) reject(err)
            else resolve(result)
        });
    });
}

function getRoomPassword(roomid){
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM rooms WHERE id = ? ;', roomid,(err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function deleteQuestionByID(QuestionID, roomList){
    return new Promise((resolve, reject) => {
        if(roomList.length == 0){
            reject();
            return ;
        }
        pool.query('DELETE FROM `questions` WHERE (`id` = ? OR `replyid` = ? ) AND roomid IN ('+ roomList.join(",") +') ;', [QuestionID, QuestionID],(err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = { queryRoombyAbbr, queryQuestionListbyRoomID, insertQuestiontoRoom, updateQuestionLike, createRoom, getRoomPassword, deleteQuestionByID }