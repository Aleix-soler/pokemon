import React, { Component } from "react";
import styles from './registres.css';
import { Redirect } from 'react-router-dom';

const API_SERVER = "172.24.4.230";

class registres extends Component{
    infoAPI = null;
    state = {
        desde: 0,
        per_pag: 5,
        pag: 1,
        infoPag: null,
        errors: '',
        loading: false,
        id: 0
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
        this.setState({
            loading:true,
            id: this.state.id++
        })
        console.log(this.state.id)
        try{
            petition = await fetch("http://"+API_SERVER+":5000/obtenir_combats_pagina?limit="+this.state.desde+"&quant="+this.state.per_pag);
            response = await petition.json();
            this.infoAPI = response;
            this.setState({
                infoPag: response.info
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
                infoPag: response.info
            })
        }
    }

    async baixarPagina(){
        if(this.state.pag>=2){
            let desde = this.state.desde-this.state.per_pag;
            console.log(desde);
            let petition = await fetch("http://"+API_SERVER+":5000/obtenir_combats_pagina?limit="+desde+"&quant="+this.state.per_pag);
            let response = await petition.json();
            this.infoAPI = response;
            if(response){
                this.setState({
                    pag: this.state.pag-1,
                    desde: desde,
                    infoPag: response.info
                })
            }
            console.log(this.state.infoPag[0])
        }
    }
    enrere(){
        this.setState({
            registres: true
        })
    }
    renderData(){
        if(this.state.infoPag!=null&&this.state.infoPag!=undefined){
            let clase;
            return(
            this.state.infoPag.id.map((element,index)=>{
                if((index%2) == 0){
                    clase = "rowTable1";
                }else{
                    clase = "rowTable2";
                }
                return(
                    <tr class={clase} key={index}>
                        <td>{this.state.infoPag.id[index]}</td>
                        <td>{this.state.infoPag.jug1[index]}</td>
                        <td>{this.state.infoPag.jug2[index]}</td>
                    </tr>
                )
            })
            )
        }
    }

    render(){
        const registre = this.state.registres ?
        <Redirect  to={{
          pathname: `/lobby`,
          userId:  this.props.location.userId
        }}/>
        :
        null;
        /*
        var data = this.state.infoPag!=null ?
        <tr>
            <td>{this.state.infoPag.info.id}</td>
            <td>{this.state.infoPag.info.jug1}</td>
            <td>{this.state.infoPag.info.jug2}</td>
        </tr>
         : null;
         */
        return(
            <div id="registres">
                {registre}
                <h1 id="titolReg">REGISTRES</h1>
                <table class="tableReg">
                    <tr class="rowHeading">
                        <th>Id</th>
                        <th>Jugador1</th>
                        <th>Jugador2</th>
                    </tr>
                    {this.renderData()}
                </table>
                <div id="pagIndex">
                        <button class="fletxaReg" onClick={() => this.baixarPagina()}>&lt;</button>
                        <button class="numeroPagReg" disabled>{this.state.pag}</button>
                        <button class="fletxaReg" onClick={() => this.pujarPagina()}>&gt;</button>
                </div>
                <button id="back" onClick={() => this.enrere()}>Tornar Menu Pokemons</button>
            </div>
        )
    }
}
export default registres;