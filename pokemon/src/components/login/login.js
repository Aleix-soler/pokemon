/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import style from './login.css';

class login extends Component{
    async loginPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://172.24.4.216:5000/login?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        console.log("LOGIN=>",json);
    }
    
    async registerPetition(){
        let user = document.getElementById('username');
        let pass = document.getElementById('password');
        let response = await fetch("http://172.24.4.216:5000/register?user="+user.value+"&pass="+pass.value);
        let json = await response.json();
        console.log("REGISTER=>",json);
    }

    render(){
        return(
            <div class="table">
                <p>Username:<input id="username" type="text"></input></p>
                <p>Password:<input id="password" type="password"></input></p>
                <button onClick={() => this.loginPetition()}>LOGIN</button>
                <button onClick={() => this.registerPetition()}>REGISTER</button>
            </div>
        )
    }
}

export default login;