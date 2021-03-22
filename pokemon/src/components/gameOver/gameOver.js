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
            text = "YOU WIN"
        }else{
            text = "YOU LOSE";
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
                <img src={"../game_over.png"} height="400px" width="400px"></img>
                <h1 id="loser-winner">{this.state.info}</h1>
                <div id={"butonsGameOver"}>
                    <button onClick={() => this.goLobby()}>GO LOBBY</button>
                </div>
            </div>
        )
    }
}

export default gameOver;