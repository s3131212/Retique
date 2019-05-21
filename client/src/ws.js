import io from 'socket.io-client';
var socket;
let roomid = 0;
function subscribeToWS(id, cb) {
    socket = io.connect('https://retique.allenchou.cc');
    socket.on('handshake', data =>{
        roomid = data.roomid;
        cb(null, data)
    });
    socket.emit('handshake', id);
}
function hookWS(cb){
    socket.on('error', (data)=>{
        alert("something went wrong");
        console.log(data);
    })
    socket.on('update', ()=>{
        console.log('recieved update');
        socket.emit('questionList', roomid);
    })
    socket.on('questionList', data => cb(null, data));
}
function newQuestion(question, author, replyid, roomid) {
    socket.emit('newQuestion', {
        question: question,
        roomid: roomid,
        replyid: replyid,
        author: author
    });
}
function updateLike(questionid, isAdd) {
    socket.emit('updateLike', {
        questionid: questionid,
        isAdd: isAdd
    });
}
export { subscribeToWS, hookWS, newQuestion, updateLike };