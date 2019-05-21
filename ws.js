const db = require('./db');

function handle(io){
    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });

        socket.on('handshake', data => {
            db.queryRoombyAbbr(data).then(results => {
                if(results.length == 0){
                    socket.emit('handshake', { roomid: 0 });
                }else{
                    socket.join(results[0].abbr);
                    socket.emit('handshake', { 
                        roomid: results[0].id,
                        roomTitle: results[0].name,
                        roomAbbr: results[0].abbr
                    });
                    socket.emit('update');
                }
            }).catch(err => {
                socket.emit('error');
            });
        });

        socket.on('newQuestion', data => {
            let room = (Object.keys( io.sockets.adapter.sids[socket.id] ).filter(item => item!=socket.id))[0];
            if(typeof data != 'object' || !('question' in data && 'roomid' in data && 'replyid' in data && 'author' in data) || data.roomid == 0) return;
            db.insertQuestiontoRoom(data.question, data.author, data.replyid, data.roomid).then(result => {
                io.to(room).emit('update');
            }).catch(err => {
                socket.emit('error', err);
            });
        });

        socket.on('questionList', data => {
            if(data == 0) return ;
            db.queryQuestionListbyRoomID(data).then(result => {
                socket.emit('questionList', result);
            }).catch(err => {
                socket.emit('error', err);
            });
        });

        socket.on('updateLike', data => {
            let room = (Object.keys( io.sockets.adapter.sids[socket.id] ).filter(item => item!=socket.id))[0];
            if(typeof data != 'object' || !('questionid' in data && 'isAdd' in data)) return;
            db.updateQuestionLike(data.questionid, data.isAdd).then(result => {
                io.to(room).emit('update');
            }).catch(err => {
                socket.emit('error', err);
            });
        })
    });
}

module.exports = handle;