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
        let text, text2;
        if(this.props.location.guanyador == true){
            console.log("props=> ",this.props)
            text = "YOU WIN";
            //text2 = "No s'ha pogut pujar la Batalla per falta de valors";
        }else{
            text = "YOU LOSE";
        }
        if(this.props.location.userId != null && this.props.location.userId != undefined && this.props.location.userId != "" && this.props.location.enemyId != null && this.props.location.enemyId != undefined && this.props.location.enemyId != ""){
            this.pujarBatalla();
            //text2 = "La batalla s'ha pujat Correctament";
        }
        
        this.setState({
            info: text
        })
        console.log(this.state.info);
    }

    async getNameByID(id){
        let trobat = false;
        let vegades = 0;
        while(!trobat){
            try{
                let petition = await fetch("http://"+API_SERVER+":5000/getNameByID?id="+id);
                let response = await petition.json();
                let username = response.username[0][0];
                console.log("ID=>",response.username[0][0])
                return username;
                trobat = true;
            }catch(exception){
                console.log(exception);
                vegades++;
                if(vegades == 3){
                    trobat = true;
                }
            }
        }
        return "none";
    }

    async pujarBatalla(){
        let username = await this.getNameByID(this.props.location.userId);
        let enemyname = await this.getNameByID(this.props.location.enemyId);
        let enemyId, userId;
        console.log("USERNAME=>",username," ENEMY=>", enemyname);
        if(username == "none"){
            userId = this.props.location.userId;   
        }else{
            userId = username;
        }
        if(enemyname == "none"){
            enemyId = this.props.location.enemyId;
        }else{
            enemyId = enemyname;
        }
        let winner;
        if(this.props.location.guanyador == true){
            winner = userId
        }else{
            winner = enemyId;
        }
        try{
            let petition = await fetch("http://"+API_SERVER+":5000/newbatalla?jug1="+userId+"&jug2="+enemyId+"&win="+winner);
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
        setTimeout(()=>{
            window.location.reload();
        },10)
    }
    render(){
        const lobby = this.state.lobby ?
        <Redirect  to={{
          pathname: `/`,
          //userId:  this.props.location.userId
        }}/>
        :
        null;
        return(
            <div id={"INFO"}>
                {lobby}
                <img src={"../game_over.png"} height="400px" width="400px"></img>
                <h1 id="loser-winner">{this.state.info}</h1>
                <p id="statusPushApi">{this.state.info2}</p>
                <div id={"butonsGameOver"}>
                    <button onClick={() => this.goLobby()}>SORTIR</button>
                </div>
            </div>
        )
    }
}

export default gameOver;