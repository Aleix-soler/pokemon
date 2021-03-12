/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import style from './login.css';

class login extends Component{
    async loginPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://172.24.4.216:5000/login?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        if(json["userid"]!=0){
            console.log("LOGIN=>",json);
        }else{
            this.errorFunction("No existeix cap usuari amb aquest Usuari/Contrasenya");
        }
        
    }
    
    async registerPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://172.24.4.216:5000/register?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        if(json["userCreated"]==1){
            console.log("REGISTER=>",json);
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
        return(
            <div class="table">
                <p id="user">Username:<input id="username" type="text"></input></p>
                <p id="pass">Password:<input id="password" type="password"></input></p>
                <button onClick={() => this.loginPetition()}>LOGIN</button>
                <button onClick={() => this.registerPetition()}>REGISTER</button>
                <p id="errors"></p>
            </div>
        )
    }
}

export default login;