from flask import Flask, render_template, request
from dependencias import Simulacion
import pickle
import json

app = Flask(__name__)

#Ruta base: página principal
@app.route('/', methods=['GET', 'POST'])
def index() :
    return render_template('index.html')


#Ruta para visualizar los datos
@app.route('/visualizar_datos', methods=['GET', 'POST'])
def elegir_futuro() :
    if request.method == 'POST':
        sensor = request.form['sensor']
        return render_template('visualizar_datos.html', sensor=sensor)


if __name__ == '__main__' :
    app.run(debug=True)