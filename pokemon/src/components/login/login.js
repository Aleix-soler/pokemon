/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import style from './login.css';

class login extends Component{
    async loginPetition(){
        var user = document.getElementById('username');
        var pass = document.getElementById('password');
        var response = await fetch("http://172.24.4.216:5000/login?user="+user.value+"&pass="+pass.value);
        var json = await response.json();
        console.log("LOGIN=>",json);
    }
    
    async registerPetition(){
        var user = document.getElementById('username');
        var pass = document.getElementById('password');
        var response = await fetch("http://172.24.4.216:5000/register?user="+user.value+"&pass="+pass.value);
        var json = await response.json();
        console.log("REGISTER=>",json);
    }

    render(){
        return(
            <div class="table">
                <p>Username:<input id="username" type="text"></input></p>
                <p>Password:<input id="password" type="password"></input></p>
                <button type="submit" onClick={() => this.loginPetition()}>LOGIN</button>
                <button type="submit" onclick={() => this.registerPetition()}>NEW USER</button>
            </div>
        )
    }
}

export default login;