/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import style from './login.css';
import { Redirect } from 'react-router-dom';

const API_SERVER = "192.168.1.172";

class login extends Component{

    state={
        userId: null
    }

    async loginPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://"+API_SERVER+":5000/login?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        if(json["userid"]!=0){
            console.log("LOGIN=>",json["userid"]);
            let userID = json["userid"]
            this.setState({
                userId: userID
            })
        }else{
            this.errorFunction("No existeix cap usuari amb aquest Usuari/Contrasenya");
        }
        
    }
    
    async registerPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://"+API_SERVER+":5000/register?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        if(json["userCreated"]==1){
            console.log("REGISTER=>",json);
            this.errorFunction("Compte Creat Correctament!!")
        }else{
            this.errorFunction("Ja existeix un usuari amb aquest nom")
        }

    }

    errorFunction(frase){
        var p = document.getElementById("errors");
        p.innerHTML=frase;
        setTimeout(() => {
            p.innerHTML = "";
        }, 5000);
    }

    render(){

        const redirect = this.state.userId ?
        <Redirect  to={{
            pathname: `/lobby/`,
            state: {"userId": this.state.userId}
        }}/>
        :
        null;

        return(
            <div>
            {redirect}
                <div class="table">
                    <p id="user">Username:<input id="username" type="text"></input></p>
                    <p id="pass">Password:<input id="password" type="password"></input></p>
                    <button onClick={() => this.loginPetition()}>LOGIN</button>
                    <button onClick={() => this.registerPetition()}>REGISTER</button>
                    <p id="errors"></p>
                </div>
            </div>
        )
    }
}

export default login;