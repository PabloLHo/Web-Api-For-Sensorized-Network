from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from faunadb import query as q
from faunadb.client import FaunaClient
from Models.sensor import Sensor
import json

fauna_client = FaunaClient(secret="fnAE-czWhAAAzJpuciEYP-P-UZlSDIp4blaPP4KT")

app = Flask(__name__)
CORS(app)


sensor = ""


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