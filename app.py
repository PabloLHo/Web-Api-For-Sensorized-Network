from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import ast
from flask import send_from_directory
import os
from faunadb import query as q
from faunadb.client import FaunaClient
from Models.sensor import Sensor
import json

fauna_client = FaunaClient(secret="fnAE-czWhAAAzJpuciEYP-P-UZlSDIp4blaPP4KT")

app = Flask(__name__)
CORS(app)


sensor = ""
sensores = []

# Ruta base: página principal
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


# Ruta para visualizar los datos
@app.route('/visualizar_datos', methods=['GET', 'POST'])
def elegir_futuro():
    global sensor
    if request.method == 'POST':
        sensor = request.form['sensor']
        sensores = []
        return render_template('visualizar_datos.html', sensor=sensor, sensoresEncendidos=sensores)



@app.route('/bateria', methods=['POST','GET'])
async def datosBateria():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']),data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Bateria"),
                {
                        "data": {
                            "datos" : nuevo.getDatos(),
                            "fecha" : nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Bateria")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/acelerometro', methods=['POST','GET'])
async def datosAcelerometro():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']),data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Acelerometro"),
                {
                        "data": {
                            "datos" : nuevo.getDatos(),
                            "fecha" : nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201

        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Acelerometro")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/proximidad', methods=['POST', 'GET'])
async def datosProximidad():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Proximidad"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Proximidad")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/giroscopio', methods=['POST', 'GET'])
async def datosGiroscopio():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Giroscopio"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Giroscopio")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/luminosidad', methods=['POST', 'GET'])
async def datosLuminosidad():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Luminosidad"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Luminosidad")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/magnetometro', methods=['POST', 'GET'])
async def datosMagnetometro():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Magnetometro"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Magnetometro")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/gps', methods=['POST', 'GET'])
async def datosGPS():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("GPS"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("GPS")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/termometro', methods=['POST', 'GET'])
async def datosTermometro():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Termometro"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Termometro")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/barometro', methods=['POST', 'GET'])
async def datosBarometro():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Barometro"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Barometro")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/humedad', methods=['POST', 'GET'])
async def datosHumedad():
    try:
        if request.method == 'POST':
            data = request.get_json()
            nuevo = Sensor(ast.literal_eval(data['datos']), data['fecha'])

            fauna_client.query(
                q.create(
                    q.collection("Humedad"),
                    {
                        "data": {
                            "datos": nuevo.getDatos(),
                            "fecha": nuevo.getFecha()
                        },
                    }
                )
            )

            return nuevo.to_dict(), 201
        elif request.method == 'GET':
            result = fauna_client.query(
                q.map_(
                    q.lambda_("X", q.get(q.var("X"))),
                    q.paginate(q.documents(q.collection("Humedad")))
                )
            )
            data = [item["data"] for item in result["data"]]
            return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured: {e}"

if __name__ == '__main__' :
    app.run(debug=True)