from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
from flask import send_from_directory
import os

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '12345'
app.config['MYSQL_DB'] = 'SensorizedApiWeb'
mysql = MySQL(app)

sensor = ""


#Ruta base: página principal
@app.route('/', methods=['GET', 'POST'])
def index() :
    return render_template('index.html')


#Ruta para visualizar los datos
@app.route('/visualizar_datos', methods=['GET', 'POST'])
def elegir_futuro() :
    global sensor
    if request.method == 'POST':
        sensor = request.form['sensor']
        return render_template('visualizar_datos.html', sensor=sensor)


@app.route('/obtener_datos', methods=['GET'])
def obtener_datos():
    global sensor
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM ' + sensor + ' ORDER BY id DESC LIMIT')
    data = cur.fetchall()
    cur.close()
    return jsonify(data)


if __name__ == '__main__' :
    app.run(debug=True)