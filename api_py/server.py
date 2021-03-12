import flask
from flask import request, jsonify, request, render_template, redirect, url_for
from flask_mysqldb import MySQL
import requests
import json


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
    info = {"userCreated": 1}
    response = jsonify(info)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

app.run(host="172.24.4.216")