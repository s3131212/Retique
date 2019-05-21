function checkLogin(roomid, password, cbsuccess, cbfail){
    fetch("/api/loginRoom", {
        method: 'POST',
        body: JSON.stringify({
            roomid: roomid,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then((data) => {
        if(data === "true"){
            cbsuccess();
        }else{
            cbfail();
        }
    });
}
function deleteQuestionByID(QuestionID, roomAbbr, cbsuccess, cbfail){
    fetch("/api/deleteQuestion", {
        method: 'POST',
        body: JSON.stringify({
            QuestionID: QuestionID,
            roomAbbr: roomAbbr
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then((data) => {
        if(data === "true"){
            cbsuccess();
        }else{
            cbfail();
        }
    });
}
function getLoginedList(cb){
    fetch("/api/getLoginedList")
    .then(res => res.json())
    .then((data) => cb(data));
}
function logoutRoom(roomid, cb){
    fetch("/api/logoutRoom?roomid=" + roomid)
    .then(res => res.text())
    .then((data) => cb(data));
}
export { checkLogin, deleteQuestionByID, getLoginedList, logoutRoom};