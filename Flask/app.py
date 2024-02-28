from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask import send_from_directory
import os
from faunadb import query as q
from faunadb.client import FaunaClient

from Models.sensor import Sensor

fauna_client = FaunaClient(secret="fnAE-czWhAAAzJpuciEYP-P-UZlSDIp4blaPP4KT")

app = Flask(__name__)
CORS(app)

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

@app.route('/baterias', methods=['POST','GET'])
async def datosBateria():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(data['datos'],data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("prueba"),
                {
                        "data": {
                            "datos" : nuevo.getDatos(),
                            "fecha" : nuevo.getFecha()
                        },
                    }
                )
            )

            return jsonify("Ok"), 201

        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("prueba")))
                )
            )
            data = [item["data"] for item in result["data"]]
            print(data)
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


if __name__ == '__main__' :
    app.run(debug=True)