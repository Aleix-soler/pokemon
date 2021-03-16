/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import style from './login.css';
import { Redirect } from 'react-router-dom';

const API_SERVER = "172.24.4.225";

class login extends Component{

    state={
        userId: null
    }

    async loginPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response;
        let json;
        try{
            response = await fetch("http://"+API_SERVER+":5000/login?user="+user.value+"&pass="+pass.value);
            json = await response.json();
            if(json["userid"]!=0){
                let userID = json["userid"]
                this.setState({
                    userId: userID
                })
            }else{
                this.errorFunction("No existeix cap usuari amb aquest Usuari/Contrasenya");
            }
        }catch(exception){
            console.log(exception)
            this.errorFunction("Hi ha hagut un error durant la Conexió")
        }
        
    }
    
    async registerPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response;
        let json;

        try{
            response = await fetch("http://"+API_SERVER+":5000/register?user="+user.value+"&pass="+pass.value);
            json = await response.json();
            if(json["userCreated"]==1){
                this.errorFunction("Compte Creat Correctament!!")
            }else{
                this.errorFunction("Ja existeix un usuari amb aquest nom")
            }
        }catch(exception){
            console.log(exception);
            this.errorFunction("Hi ha hagut un error durant la Conexió")
        }
    }

    noDbLogin(){
        let aux = Math.floor(Math.random()*1000000);
        this.setState({
            userId: aux
        })
    }

    errorFunction(frase){
        var p = document.getElementById("errors");
        p.innerHTML=frase;
        /*
        setTimeout(() => {
            p.innerHTML = "";
        }, 5000);
        */
    }

    render(){

        const redirect = this.state.userId ?
        <Redirect  to={{
            pathname: `/lobby/`,
            userId:  this.state.userId
        }}/>
        :
        null;

        return(
            <div>
            {redirect}
                <div class="table">
                    <input id="username" placeholder="Username" type="text"></input><br></br>
                    <input id="password" placeholder="Password" type="password"></input><br></br>
                    <button id="login" class="button" onClick={() => this.loginPetition()}>LOGIN</button>
                    <button id="register" class="button" onClick={() => this.registerPetition()}>REGISTER</button><br></br>
                    <button id="anonymous" onClick={() => this.noDbLogin()}>NO DB LOGIN</button>
                    <p id="errors"></p>
                </div>
            </div>
        )
    }
}

export default login;