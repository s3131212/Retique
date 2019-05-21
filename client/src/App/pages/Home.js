import React, { Component } from 'react';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomValue: '',
            enterBtn: "Enter Room"
        };
        this.handleChange = this.handleChange.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }
    componentDidMount() {
        document.title = "Retique";
    }
    handleChange(event) {
        this.setState({ roomValue: event.target.value });
    }
    enterRoom(){
        this.setState({ enterBtn:  "Loading..."});
        fetch("/api/checkRoom?abbr=" + this.state.roomValue)
        .then(res => res.text())
        .then((data) => {
            if(data === "true"){
                this.setState({ enterBtn:  "Redirecting..."});
                this.props.history.push('/room/' + this.state.roomValue);
            }else{
                this.setState({ enterBtn: "Room not exist" });
                setTimeout(() => this.setState({ enterBtn:  "Enter Room"}), 1000);
            }
        });
    }
    render() {
        return (
            <div>
                <div className="ts vertically extra padded heading slate">
                    <div className="image">
                        <img src="header.jpg" alt="" />
                    </div>
                    <div className="ts narrow container">
                        <div className="ts grid stackable">
                            <div className="six wide column left floated verticallyCenteredContainer">
                                <h1 className="ts massive header superlarge">Retique</h1>
                                <h2 className="ts sub header bitlarge">Real Time Question System</h2>
                            </div>
                            <div className="six wide column right floated verticallyCenteredContainer">
                                <div className="ts hidden divider mobile only"></div>
                                <form className="ts form verticallyCentered">
                                    <div className="field">
                                        <input type="text" name="room" id="room" placeholder="Room Code" value={this.state.roomValue} onChange={this.handleChange}
                                            onKeyPress={(e) => { if(e.key === 'Enter'){this.enterRoom(this.state.roomValue); e.preventDefault(); }}}/>
                                    </div>
                                    <div className="ts fluid stackable buttons">
                                        <button type="button" className="ts primary button" onClick={this.enterRoom}>{this.state.enterBtn}</button> 
                                        <button type="button" className="ts positive button" onClick={ ()=> this.props.history.push('/create') }>Create Room</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ts hidden divider"></div>
                <div className="ts narrow container">
                    <div className="ts four cards stackable">
                        <div className="ts card">
                            <div className="content padded">
                                <div className="header center aligned">
                                    <i className="huge cloud icon"></i><br /><br />
                                    Instant synchronization
                                </div>
                                <div className="description">
                                    Retique can synchronize new comments and room status immediately. You'll never miss any question and feedback!
                                </div>
                            </div>
                        </div>
                        <div className="ts card">
                            <div className="content padded">
                                <div className="header center aligned">
                                    <i className="huge share icon"></i><br /><br />
                                    Easy to share
                                </div>
                                <div className="description">
                                    In order to invite everyone to your room, all you need is to share the URL or the Code (Room Abbreviation).
                                </div>
                            </div>
                        </div>
                        <div className="ts card">
                            <div className="content padded">
                                <div className="header center aligned">
                                    <i className="huge users icon"></i><br /><br />
                                    Wide Range of Uses
                                </div>
                                <div className="description">
                                    Retique is a multipurpose app. You can use it in classrooms, meetings, conferences, and more. You name it!
                                </div>
                            </div>
                        </div>
                        <div className="ts card">
                            <div className="content padded">
                                <div className="header center aligned">
                                    <i className="huge privacy icon"></i><br /><br />
                                    Easy to manage
                                </div>
                                <div className="description">
                                    It's always a pain to manage a room with many people. In Retique, share the room password with your teammate, that's all!
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ts hidden divider"></div>
                    <div className="ts narrow container">
                        <div className="ts grid">
                        <div className="one wide column left floated"></div>
                        <div className="eight wide column left floated">
                            <img className="ts bordered fluid image" src="screenshot.png" alt="Screenshot of retique" />
                        </div>
                        <div className="six wide column right floated verticallyCenteredContainer center aligned">
                            <div className="verticallyCentered center aligned">
                            <h2 className="ts icon header">
                                <i className="idea icon"></i>Try it now!
                                <div className="sub header">It's completely free and <a href="https://github.com/s3131212">open source</a>.</div>
                            </h2>
                            <div className="ts hidden divider"></div>
                            <button className="ts big inverted button" onClick={ ()=> this.props.history.push('/create') }>Create Room</button>
                            </div>
                        </div>    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;