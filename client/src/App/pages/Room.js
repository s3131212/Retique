import React, { Component } from 'react';
import 'sweetalert/dist/sweetalert.css';
import { subscribeToWS, hookWS, newQuestion, updateLike } from '../../ws.js';
import { deleteQuestionByID, getLoginedList } from '../../fetchapi.js';
import { LoginForm, LoginButton, ReplyBox, QuestionList } from '../components/Room'

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomid: 0,
            roomTitle: 'Loading',
            roomAbbr: '',
            taValue: '',
            nameValue: '',
            questionList: [],
            originalQuestionList: [],
            likeList: [],
            sortMethod: 'likes',
            replyID: 0,
            showLoginForm: false,
            isLogin: false
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleTAChange = this.handleTAChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.newQuestion = this.newQuestion.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.writeQuestionList = this.writeQuestionList.bind(this);
        this.replyQuestionPress = this.replyQuestionPress.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    componentDidMount(){
        subscribeToWS(this.props.location.pathname.substring("/room/".length), (err, data) => {
            if (data.roomid === 0) {
                this.props.history.push('/');
                return;
            }

            this.setState({
                roomid: data.roomid,
                roomTitle: data.roomTitle,
                roomAbbr: data.roomAbbr
            });

            getLoginedList((loginedlist) => {
                if(loginedlist.indexOf(data.roomid) !== -1){
                    this.setState({ isLogin: true });
                }
            })

            document.title = data.roomTitle + " - Retique";
        });

        hookWS((err, data) => {
            this.writeQuestionList(this.state.sortMethod, data);
        })

        if(localStorage.getItem('likeList') == null) localStorage.setItem('likeList', '[]');
        else this.setState({ likeList: JSON.parse(localStorage.getItem('likeList')) });
    }

    handleTAChange(event) {
        this.setState({ taValue: event.target.value });
    }

    handleNameChange(event) {
        this.setState({ nameValue: event.target.value });
    }

    newQuestion() {
        newQuestion(this.state.taValue, this.state.nameValue, this.state.replyID, this.state.roomid);
        this.setState({
            taValue: '',
            replyID: 0
        });
    }

    handleLike(QuestionID){
        let list = this.state.likeList;
        if(list.includes(QuestionID)){
            list.splice(list.indexOf(QuestionID), 1);
            updateLike(QuestionID, false);
        }else{
            list.push(QuestionID);
            updateLike(QuestionID, true);
        }
        this.setState({ likeList: list });
        localStorage.setItem('likeList', JSON.stringify(list));
    }

    changeSort(event){
        this.writeQuestionList(event.target.value, this.state.originalQuestionList);
        this.setState({ sortMethod: event.target.value });
    }

    writeQuestionList(sortMethod, originalQuestionList){
        let questionList = JSON.parse(JSON.stringify(originalQuestionList));
        if(sortMethod === "likes"){
            questionList.sort(function(a, b){
                if (a.like < b.like) {
                    return 1;
                }else if (a.like > b.like) {
                    return -1;
                }else{
                    if(a.timestamp < b.timestamp){
                        return 1;
                    }else if(a.timestamp > b.timestamp){
                        return -1;
                    }else{
                        return 0;
                    }
                }
            });
        }else{
            questionList.sort(function(a, b){
                if (a.timestamp < b.timestamp) {
                    return 1;
                }else if (a.timestamp > b.timestamp) {
                    return -1;
                }else{
                    if(a.like < b.like){
                        return 1;
                    }else if(a.like > b.like){
                        return -1;
                    }else{
                        return 0;
                    }
                }
            });
        }
        // Bad performance, wait to be fixed.
        let nest = (items, id = 0, link = 'replyid') =>
            items
                .filter(item => item[link] === id)
                .map(item => ({ ...item, reply: nest(items, item.id) }));

        questionList = nest(questionList, 0);
        this.setState({ questionList: questionList, originalQuestionList: originalQuestionList });
    }

    replyQuestionPress(QuestionID){
        if(QuestionID !== this.state.replyID){
            this.setState({ replyID: QuestionID });
        }else{
            this.setState({ replyID: 0 });
        }
    }

    deleteQuestion(QuestionID){
        if(!this.state.isLogin) return;
        deleteQuestionByID(QuestionID, this.state.roomAbbr, () => {
            console.log("success");
        }, () => {
            console.log("failed");
        })
    }

    render() {
        return (
            <div className="ts very narrow relaxed stackable container grid">
                <LoginForm
                    toggleLoginForm={(show) => {this.setState({ showLoginForm: show })}}
                    show={this.state.showLoginForm}
                    roomid={this.state.roomid}
                    setLogin={() => {this.setState({ isLogin: true })}}
                />
                <div className="sixteen wide column">
                    <h1 className="ts center aligned header">
                        {this.state.roomTitle}
                        <div className="sub header">
                            Leave your questions or comments here!
                        </div>
                    </h1>
                </div>
                <div className="sixteen wide column">
                    <div className="ts segment">
                        <ReplyBox replyID={this.state.replyID} question={this.state.questionList.filter(o => o.id === this.state.replyID)} />
                        <div className="ts borderless horizontally fitted fluid input underlined">
                            <textarea rows="5" placeholder="Your question or comment" value={this.state.taValue} onChange={this.handleTAChange}></textarea>
                        </div>
                        <div className="ts fitted divider"></div>
                        <div className="ts borderless horizontally fitted fluid input underlined input">
                            <input type="text" value={this.state.nameValue} onChange={this.handleNameChange} placeholder="Name (Optional)" />
                        </div>
                        <div className="ts secondary fitted menu">
                            <div className="item">
                                <button className="ts mini primary button" onClick={this.newQuestion}>Submit</button>
                            </div>
                            <div className="item right">
                                <div className="ts form">
                                    <div className="field" onChange={this.changeSort} value={this.state.sortMethod}>
                                        <select>
                                            <option value="likes">Sort by likes</option>
                                            <option value="time">Sort by time</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sixteen wide column">
                    <QuestionList
                        questionList={this.state.questionList}
                        handleLike={this.handleLike}
                        likeList={this.state.likeList}
                        replyQuestionPress={this.replyQuestionPress}
                        isReply={(id) => this.state.replyID === id}
                        deleteQuestion={this.deleteQuestion}
                        isLogin={this.state.isLogin}
                    />
                    <div className="ts hidden divider"></div>
                    <div className="ts five column centered grid">
                        <div className="column">
                            <LoginButton
                                showLoginForm={() => this.setState({ showLoginForm: true })}
                                isLogin={this.state.isLogin}
                                setLogout={() => this.setState({isLogin: false})}
                                roomid={this.state.roomid}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Room;