import React, { Component } from 'react';
import Moment from 'react-moment';
import * as moment from 'moment'
import 'moment-timezone';
import { checkLogin, logoutRoom } from '../../fetchapi.js';
import SweetAlert from 'sweetalert-react';
import swal from 'sweetalert';

function scrollToTop(scrollDuration) {
    var cosParameter = window.scrollY / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();
    function step (newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.scrollY === 0) return;
        window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
class LikeButton extends Component {
    render(){
        if(this.props.inList){
            return (
                <button className="ts right labeled icon button primary"  onClick={() => this.props.handleLike(this.props.id)}>
                    {this.props.like}
                    <i className="thumbs up icon"></i>
                </button>
            )
        }else{
            return (
                <button className="ts right labeled icon button"  onClick={() => this.props.handleLike(this.props.id)}>
                    {this.props.like}
                    <i className="thumbs up outline icon"></i>
                </button>
            )
        }
    }
}
class DeleteButton extends Component {
    render(){
        if(this.props.isLogin){
            return (
                <button className="ts icon button"  onClick={() => this.props.deleteQuestion(this.props.id)}>
                    <i className="trash outline icon"></i>
                </button>
            )
        }else{
            return (null)
        }
    }
}
class ReplyButton extends Component {
    render(){
        if(this.props.isReply){
            return (
                <button className="ts icon button info" onClick={this.props.onClick}>
                    <i className="share outline icon"></i>
                </button>
            )
        }else{
            return (
                <button className="ts icon button"  onClick={ ()=> {this.props.onClick(); scrollToTop(500); }}>
                    <i className="share outline icon"></i>
                </button>
            )
        }
    }
}
class LoginForm extends Component {
    render(){
        return (
            <div>
                <SweetAlert
                    show={this.props.show}
                    title="Password"
                    text="Please enter password for this room."
                    type="input"
                    inputType="password"
                    inputPlaceholder="Password"
                    onConfirm={(inputValue) => {
                        if (inputValue === '') {
                            swal.showInputError('You need to enter something!');
                            return;
                        }
                        checkLogin(this.props.roomid, inputValue,() => {
                            this.props.setLogin();
                            this.props.toggleLoginForm(false);
                        }, ()=> {
                            swal.showInputError('Password incorrect.');
                        });
                        
                    }}
                    onEscapeKey={() => this.props.toggleLoginForm(false)}
                    onOutsideClick={() => this.props.toggleLoginForm(false)}
                />
            </div>
        )
    }
}
class LoginButton extends Component {
    render(){
        if(!this.props.isLogin){
            return (
                <button className="ts centered button fluid" onClick={this.props.showLoginForm}>Login</button>
            )
        }else{
            return (
                <button className="ts centered button fluid" onClick={()=>{
                    logoutRoom(this.props.roomid, (data)=>{
                        if(data === "true"){
                            this.props.setLogout();
                        }
                    });
                }}>Logout</button>
            )
        }
    }
}
class ReplyBox extends Component {
    render(){
        if(this.props.replyID !== 0){
            return (
                <blockquote className="ts quote">
                Reply to {(this.props.question[0].author) ? this.props.question[0].author : "Annonymous"}:<br />
                {this.props.question[0].content}
                </blockquote>
            )
        }else{
            return (null);
        }
        
    }
}
class QuestionList extends Component {
    render(){
        return (
            <div className="ts stackable cards">
            {this.props.questionList.map((q) => {
                return (
                    <div className="ts card sixteen wide column" key={q.id}>
                        <div className="content">
                            <div className="actions">
                                <div className="ts separated icon buttons">
                                    <LikeButton handleLike={this.props.handleLike} id={q.id} like={q.like} inList={this.props.likeList.includes(q.id)}></LikeButton>
                                    <ReplyButton onClick={() => this.props.replyQuestionPress(q.id)} isReply={this.props.isReply(q.id)} />
                                    <DeleteButton isLogin={this.props.isLogin} deleteQuestion={() => this.props.deleteQuestion(q.id)} id={this.props.isReply(q.id)} />
                                </div>
                            </div>
                            <div className="header author">{(q.author) ? q.author : "Annonymous"}</div>
                            <div className="meta">
                                <div><Moment local format="YYYY/MM/DD hh:mm:ss A" fromNowDuring="86400000" utc tz={moment.tz.guess()}>{q.timestamp}</Moment></div>
                            </div>
                            <div className="description">
                                <p>{q.content}</p>
                            </div>
                            <ReplyList
                                reply={q.reply}
                                handleLike={this.props.handleLike}
                                likeList={this.props.likeList}
                                deleteQuestion={this.props.deleteQuestion}
                                isLogin={this.props.isLogin}
                            />
                        </div>
                    </div>
                );
            })
        }</div>)
    }
}
class ReplyList extends Component {
    render(){
        return (
        <div className="ts comments">
            { this.props.reply.map(r => {
                return (
                    <div className="comment" key={r.id}>
                        <div className="avatar">
                            <i className="circular comment icon large"></i>
                        </div>
                        <div className="content">
                            <span className="author">{(r.author) ? r.author : "Annonymous"}</span>
                            <div className="metadata">
                                <div><Moment local format="YYYY/MM/DD hh:mm:ss A" fromNowDuring="86400000" utc tz={moment.tz.guess()}>{r.timestamp}</Moment></div>
                            </div>
                            <div className="text">
                                {r.content}
                            </div>
                            <div className="actions">
                                
                                {this.props.likeList.includes(r.id)
                                    ? (
                                        <a className="ts left icon" onClick={() => this.props.handleLike(r.id)} style={ { color: "#00ADEA" } }>
                                            <i className="thumbs up icon"></i>
                                            {r.like} Like{(r.like > 1 ? "s" : "")}
                                        </a>
                                    )
                                    : (
                                        <a className="ts left icon" onClick={() => this.props.handleLike(r.id)}>
                                            <i className="thumbs up outline icon"></i>
                                            {r.like} Like{(r.like > 1 ? "s" : "")}
                                        </a>
                                    )
                                }
                                {this.props.isLogin
                                    ? (
                                        <a className="ts left icon" onClick={() => this.props.deleteQuestion(r.id)} style={{ marginLeft: "15px" }}>
                                            <i className="trash icon"></i>
                                            Remove
                                        </a>
                                    )
                                    : (null)
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        )
    }
}

export { LikeButton, DeleteButton, ReplyButton, LoginForm, LoginButton, ReplyBox, QuestionList }