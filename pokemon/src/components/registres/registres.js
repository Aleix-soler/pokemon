import React, { Component } from "react";
import registre from './registra';
import style from './registres.css';
import { Redirect } from 'react-router-dom';

const API_SERVER = "192.168.0.172";

class registres extends Component{
    state = {
        desde: 0,
        per_pag: 2,
        pag: 1,
        infoPag: null,
        errors: ''
    }

    obtenirValorsPagina(pagina){
        if(pagina > 1){
            this.setState({
                desde: this.state.pag*this.state.per_pag
            })
        }
    }
    componentDidMount(){
        this.obtenirDataPag();
    }
    async obtenirDataPag(){
        let petition;
        let response;
        try{
            petition = await fetch("http://"+API_SERVER+":5000/obtenir_combats_pagina?limit="+this.state.desde+"&quant="+this.state.per_pag);
            response = await petition.json();
            this.setState({
                infoPag: response["combats"]
            }) 
        }catch(exception){
            console.log(exception);
            this.setState({
                errors: "No s'ha pogut Conectar amb el Servidor"
            })
        }
    }

    async pujarPagina(){
        let desde = this.state.per_pag*this.state.pag;
        console.log(desde);
        let petition = await fetch("http://"+API_SERVER+":5000/obtenir_combats_pagina?limit="+desde+"&quant="+this.state.per_pag);
        let response = await petition.json();
        console.log(response)
        if(response){
            this.setState({
                pag: this.state.pag+1,
                desde: desde,
                infoPag: response["combats"]
            })
        }
    }

    async baixarPagina(){
        if(this.state.pag>=2){
            let desde = this.state.desde-this.state.per_pag;
            console.log(desde);
            let petition = await fetch("http://"+API_SERVER+":5000/obtenir_combats_pagina?limit="+desde+"&quant="+this.state.per_pag);
            let response = await petition.json();
            if(response){
                this.setState({
                    pag: this.state.pag-1,
                    desde: desde,
                    infoPag: response["combats"]
                })
            }
            console.log(this.state.infoPag[0])
        }
    }

    render(){
        let data = this.state.infoPag;
        return(
            <div id="registres">
                <p>REGISTRES</p>
                {data}
                <p id="errors">{this.state.errors}</p>
                <div id="pagIndex">
                    <span><button onClick={() => this.baixarPagina()}>&lt;</button></span>{this.state.pag}<span><button onClick={() => this.pujarPagina()}>&gt;</button></span>
                </div>
            </div>
        )
    }
}
export default registres;