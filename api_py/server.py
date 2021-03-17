import flask
from flask import request, jsonify, request, render_template, redirect, url_for
from flask_mysqldb import MySQL
import requests
import json

server = "192.168.0.172";
app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Configure db

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'pokemon'

mysql = MySQL(app)

@app.route('/', methods=['GET'])
def home():
    return "BENVINGUT A LA API DE POKEMON";

#LOGIN FUNCTION
@app.route('/login', methods=['GET'])
def login():
    if 'user' in request.args and 'pass' in request.args:
        user = str(request.args['user'])
        password = str(request.args['pass'])
    else:
        info = {"userid": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
    cur=mysql.connection.cursor()
    value = cur.execute("SELECT id FROM users WHERE user=%s AND pass=%s", (user, password))
    if value > 0:
        info = {"userid": cur.fetchall()[0][0]}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    mysql.connection.commit()
    cur.close()
    info = {"userid": 0}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

#REGISTER FUNCTION        
@app.route('/register', methods=['POST', 'GET'])
def register():
    if 'user' in request.args and 'pass' in request.args:
        user = str(request.args['user'])
        password = str(request.args['pass'])
    else:
        info = {"userCreated": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
    if user == '' or password != '':
        info = {"userCreated": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    cur=mysql.connection.cursor()
    value = cur.execute("SELECT id FROM users WHERE user=%s AND pass=%s", (user, password))
    if value > 0:
        info = {"userCreated": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    cur = mysql.connection.cursor()
    value = cur.execute("INSERT INTO users (user, pass) VALUES (%s, %s)", (user,password))
    mysql.connection.commit()
    cur.close()
    info = {"userCreated": 1}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/batalles', methods=['GET'])
def batalles():
    cur = mysql.connection.cursor()
    value = cur.execute("SELECT * FROM Combats ORDER BY id ASC")
    if value > 0:
        info = {"batalles": cur.fetchall()}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    mysql.connection.commit()
    cur.close()
    return "No hi han batalles"

@app.route('/batalla', methods=['GET'])
def batalla():
    if 'id' in request.args:
        id = str(request.args['id'])
    else:
        info = {"batalla": "null"}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    cur = mysql.connection.cursor()
    value = cur.execute("SELECT * FROM Combats WHERE id="+id)
    if value > 0:
        info = cur.fetchall()
        for row in info:
            data = {"batalla": {"id": row[0], "jugador1": row[1], "jugador2": row[2]}}
        response = jsonify(data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    mysql.connection.commit()
    cur.close()
    info = {"batalla": "null"}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/newbatalla', methods=['GET', 'POST'])
def newBatalla():
    if 'jug1' and 'jug2' and 'win' in request.args:
        jug1 = str(request.args['jug1'])
        jug2 = str(request.args['jug2'])
        guanyador = str(request.args['win'])
    else:
        info = {"batallaInsertada": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    cur = mysql.connection.cursor()
    value = cur.execute("INSERT INTO Combats (idJugador1, idJugador2, Guanyador) VALUES (%s, %s, %s)", (jug1, jug2, guanyador))
    if value > 0:
        info = {"batallaInsertada": 1}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    mysql.connection.commit()
    cur.close()
    info = {"batallaInsertada": 0}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/new_registre_batalla', methods=['GET', 'POST'])
def newRegistreBatalla():
    if 'jugador' and 'idBatalla' and 'atac' and 'punts_atac' in request.args:
            jug = str(request.args['jugador'])
            idBatalla = str(request.args['idBatalla'])
            atac = str(request.args['atac'])
            punts_atac = str(request.args['punts_atac'])
    else:
        info = {"insertar_registre": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    cur = mysql.connection.cursor()
    value = cur.execute("SELECT * FROM combats WHERE id=%s", (idBatalla));
    if value > 0:
        cur = mysql.connection.cursor()
        value = cur.execute("INSERT INTO registre_combats (idCombat, idJugador, atac, punts_atac) VALUES (%s,%s,%s,%s)", (idBatalla, jug, atac, punts_atac))
        if value > 0:
            info = {"insertar_registre": 1}
            response = jsonify(info)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        mysql.connection.commit()
        cur.close()
    info = {"insertar_registre": 0}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/obtenir_registres_batalla', methods=['GET'])
def obtenirRegistresBatalla():
    if 'id' in request.args:
        id = str(request.args['id'])
    else:
        info = {"registres_batalla": 0}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    cur = mysql.connection.cursor()
    value = cur.execute("SELECT * FROM registre_combats WHERE idCombat=%s ORDER BY id ASC", (id))
    if value > 0:
        info = {"registres_moviment": cur.fetchall()}
        response = jsonify(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    info = {"registres_batalla": 0}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/obtenir_combats_pagina', methods=['GET'])
def obtenirCombatsPagina():
    if "limit" and "quant" in request.args:
        limit = int(request.args['limit'])
        quant = int(request.args['quant'])
    else:
        info = {"combats": 0}
        response = jsonfiy(info)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
    cur = mysql.connection.cursor()
    value = cur.execute("SELECT id, idJugador1, idJugador2 FROM combats ORDER BY id ASC LIMIT %s,%s",(limit, quant))
    if value > 0:
        info = cur.fetchall()
        row0 = []
        row1 = []
        row2 = []
        for row in info:
            row0.append(row[0])
            row1.append(row[1])
            row2.append(row[2])
        data = {"info": {"id": row0, "jug1": row1, "jug2": row2, "test": row}}
        response = jsonify(data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    info = {"combats": 0}
    response = jsonfiy(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

app.run(host=server)