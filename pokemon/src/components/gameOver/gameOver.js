import React, { Component } from "react";
import styles from './gameOver.css';
import { Redirect } from 'react-router-dom';
import url from '../Connections'  
const API_SERVER = url.Ip;

class gameOver extends Component {
    
    state = {
        info: "Ni flowers"
    }

    componentDidMount(){
        console.log(this.props);
        let text;
        if(this.props.location.guanyador == true){
            this.pujarBatalla()
            text = "WINNER"
        }else{
            text = "LOSER";
        }
        this.setState({
            info: text
        })
        console.log(this.state.info);
    }
    async pujarBatalla(){
        let userId = this.props.location.userId;
        let enemyId = this.props.location.enemyId;
        try{
            let petition = await fetch("http://"+API_SERVER+":5000/newbatalla?jug1="+userId+"&jug2="+enemyId+"&win="+userId);
            let response = await petition.json();
            console.log(response)
        }catch(exception){
            console.log(exception);
        }
    }
    goLobby(){
        this.setState({
            lobby: true
        })
    }
    render(){
        const lobby = this.state.lobby ?
        <Redirect  to={{
          pathname: `/lobby`,
          userId:  this.props.location.userId
        }}/>
        :
        null;
        return(
            <div id={"INFO"}>
                {lobby}
                <p>{this.state.info}</p>
                <div id={"butonsGameOver"}>
                    <button onClick={() => this.goLobby()}>GO LOBBY</button>
                </div>
            </div>
        )
    }
}

export default gameOver;