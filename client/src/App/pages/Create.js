import React, { Component } from 'react';


class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnValue: 'Create Room',
            name: '',
            abbr: '',
            pwd: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }
    componentDidMount() {
        document.title = "Create - Retique";
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    createRoom(){
        if(this.state.name === '' || this.state.abbr === '' || this.state.pwd === ''){
            this.setState({ btnValue:  "Missing data"})
            setTimeout(()=> this.setState({ btnValue:  "Create Room"}), 1000)
            return ;
        }

        this.setState({ enterBtn:  "Loading..."});
        fetch("/api/createRoom", {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                abbr: this.state.abbr,
                pwd: this.state.pwd
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.text())
        .then((data) => {
            if(data === "true"){
                this.setState({ enterBtn:  "Redirecting..."});
                this.props.history.push('/room/' + this.state.abbr);
            }else if(data === "duplicate abbr"){
                alert("Duplicate Abbreviation");
            }else if(data === "missing data"){
                alert("Missing Data");
            }else{
                alert("Something went wrong...");
                console.log(data);
            }
        });
    }
    render() {
        return (
            <div className="ts very narrow relaxed stackable container grid">
                <div className="sixteen wide column">
                    <h1 className="ts center aligned header">
                        Retique
                        <div className="sub header">
                            Real Time Question System
                        </div>
                    </h1>
                </div>
                <div className="ts centered segment">
                    <h3 className="ts center aligned header">Create Room</h3>
                    <form className="ts form">
                        <div className="field">
                            <label>Room Name</label>
                            <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} />
                        </div>
                        <div className="field">
                            <label>Room Abbreviation<br />(For identifying and connecting to room)</label>
                            <input type="text" name="abbr" id="abbr" value={this.state.abbr} onChange={this.handleChange} />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input type="text" name="pwd" id="pwd" value={this.state.pwd} onChange={this.handleChange} />
                        </div>
                        <div className="ts buttons fluid">
                            <button type="button" className="ts primary button" onClick={this.createRoom}>{this.state.btnValue}</button> 
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Create;