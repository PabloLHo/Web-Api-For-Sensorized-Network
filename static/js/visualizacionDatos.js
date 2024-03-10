var graficas = {};
var valor;
var datos = {"Podometro": [], "Bateria": [],"Giroscopio": [], "Magnetometro": [], "Acelerometro": [], "Proximidad": [], "Luminosidad": [], "Termometro": [], "Barometro": [], "Humedad": []};
var fechas = {"Podometro": [], "Bateria": [],"Giroscopio": [], "Magnetometro": [], "Acelerometro": [], "Proximidad": [], "Luminosidad": [], "Termometro": [], "Barometro": [], "Humedad": []};
var sensores = ["Podometro", "Bateria", "Giroscopio", "Magnetometro", "Acelerometro", "Proximidad", "Luminosidad", "GPS", "Clima"];
var todosSensores = ["Podometro", "Bateria", "Giroscopio", "Magnetometro", "Acelerometro", "Proximidad", "Luminosidad", "GPS", "Barometro", "Termometro", "Humedad"];
var uniVariable = {"Podometro": true, "Bateria": true,"Giroscopio": false, "Magnetometro": false, "Acelerometro": false, "Proximidad": true, "Luminosidad": true, "Clima": false}
var actualizacion = {"Podometro": 90000, "Bateria": 120000,"Giroscopio": 30000, "Magnetometro": 60000, "Acelerometro": 15000, "Proximidad": 15000, "Luminosidad": 30000,"GPS": 90000, "Clima": 600000};
var unidades = { "Podometro": "Pasos", "Bateria": "%","Giroscopio": "Radianes / s", "Magnetometro": "µT", "Acelerometro": 'm / s', "Proximidad": "cm", "Luminosidad": "lx", "Clima": ["hPa", "ºC", "%"] }
var actualizado = {"Podometro": true, "Bateria": true,"Giroscopio": true, "Magnetometro": true, "Acelerometro": true, "Proximidad": true, "Luminosidad": true, "Clima": true}

function onload() {

    valor = sensor;

    encendidos();

    window.setInterval(encendidos,10000);

    if(valor === "Batería")
        document.getElementById("indicadorBateria").style.display = "none";

    if (valor === "Todos") {

        document.getElementById("titulo").innerHTML = "Todos los sensores";

        for (var i = 0; i < sensores.length; i++) {

            document.getElementById(sensores[i]).style.display = "block";
            document.getElementById("separador-" + sensores[i]).style.display = "block";
            window["actualizar" + sensores[i]]();
            window.setInterval(window["actualizar" + sensores[i]], actualizacion[sensores[i]]);

        }

    } else {

        sensorST = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        document.getElementById(sensorST).style.display = "block";
        window["actualizar" + sensorST]();
        window.setInterval(window["actualizar" + sensorST], actualizacion[sensorST]);

    }

    if(valor === "GPS" || valor === "Todos")
        crearMapa();

}

async function obtenerDatos(sensorST){
    try {

        return await $.ajax({
            url: '/' + sensorST,
            type: 'GET'
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function guardarDatos(sensorST, data){

    for(var i = 0; i < data.length; i++){
        fechas[sensorST].push(data[i].datos);
        datos[sensorST].push(data[i].fecha);
    }

}

function actualizarAcelerometro(){

    var sensorST = "Acelerometro";
    console.log("Actualizando " + sensorST);

    var data = obtenerDatos(sensorST);
    data.then((valor) => {
        var actual = valor[valor.length - 1].datos;

        var numero_x = actual[0];
        var numero_y = actual[1];
        var numero_z = actual[2];

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }


        giro_x = 60 + Math.abs(numero_x) * 14.5;
        giro_y = 60 + Math.abs(numero_y) * 14.5;
        giro_z = 60 + Math.abs(numero_z) * 14.5;

        document.getElementById("actual-" + sensorST + "-x").innerHTML = numero_x.toFixed(2);
        document.getElementById("actual-" + sensorST + "-y").innerHTML = numero_y.toFixed(2);
        document.getElementById("actual-" + sensorST + "-z").innerHTML = numero_z.toFixed(2);
        document.getElementById("dash").style.transform = "rotate(" + giro_x + "deg)";
        document.getElementById("dash-y").style.transform = "rotate(" + giro_y + "deg)";
        document.getElementById("dash-z").style.transform = "rotate(" + giro_z + "deg)";
    });

}

function actualizarBateria() {

    var sensorST = "Bateria";
    var data = obtenerDatos(sensorST);


    data.then((valor) => {
        var actual = valor[valor.length - 1].datos;
        var bateria = actual[0];

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }

        var root = document.documentElement;
        root.style.setProperty('--carga', bateria + '%');

        if (bateria > 40)
            root.style.setProperty('--color-carga', "lime");
        else
            root.style.setProperty('--color-carga', "orange");
    });
}

function actualizarGiroscopio() {

    var sensorST = "Giroscopio";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        var actual = valor[valor.length - 1].datos;

        var numero_x = actual[0] * 180 / Math.PI;
        var numero_y = actual[1] * 180 / Math.PI;
        var numero_z = actual[2] * 180 / Math.PI;

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }

        var elementoX = document.querySelector('.total-x');
        elementoX.style.transform = 'rotateX(' + numero_x + 'deg)';

        var elementoY = document.querySelector('.total-y');
        elementoY.style.transform = 'rotateY(' + numero_y + 'deg)';

        var elementoZ = document.querySelector('.total-z');
        elementoZ.style.transform = 'rotateZ(' + numero_z + 'deg)';
    });
}

function actualizarMagnetometro() {

    var sensorST = "Magnetometro";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        var actual = valor[valor.length - 1].datos;

        var numero_x = actual[0];
        var numero_y = actual[1];
        var numero_z = actual[2];

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }

        document.getElementById("actual-" + sensorST + "-x").innerHTML = numero_x.toFixed(2);
        document.getElementById("actual-" + sensorST + "-y").innerHTML = numero_y.toFixed(2);
        document.getElementById("actual-" + sensorST + "-z").innerHTML = numero_z.toFixed(2);

        var absoluto = Math.sqrt(Math.pow(numero_x, 2) + Math.pow(numero_y, 2) + Math.pow(numero_z, 2));

        document.getElementById("text-magnetometro").innerHTML = absoluto.toFixed(2) + "&microT";

        var radianes = Math.atan2(actual[1], actual[0]);
        var grados = radianes * 180 / Math.PI;
        document.getElementById("img_brujula").style.transform = "rotate(" + grados + "deg)";
    });
}

function actualizarClima() {

    var sensorST = "Clima";
    console.log("Actualizando " + sensorST);

    var dataTemp = obtenerDatos("Termometro");
    var dataHum = obtenerDatos("Humedad");
    var dataPre = obtenerDatos("Barometro");

    dataTemp.then((valor) => {

        var actual = valor[valor.length - 1].datos;
        document.getElementById("actual-Temperatura").innerHTML = actual;

        guardarDatos("Termometro", valor);

    });

    dataHum.then((valor) => {

        var actual = valor[valor.length - 1].datos;
        document.getElementById("actual-Humedad").innerHTML = actual;

        guardarDatos("Humedad", valor);

    });

    dataPre.then((valor) => {

        var actual = valor[valor.length - 1].datos;
        document.getElementById("actual-Barometro").innerHTML = actual;

        guardarDatos("Barometro", valor);

    });

    preparacionClima()


}

function actualizarPodometro() {
    var sensorST = "Podometro";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {

        var actual = valor[valor.length - 1].datos;

        document.getElementById("actual-" + sensorST + "-x").innerHTML = actual;

        guardarDatos(sensorST, valor);

    });
}

function actualizarLuminosidad() {

    var sensorST = "Luminosidad";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {

        var actual = valor[valor.length - 1].datos[0];

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }

        document.getElementById("actual-" + sensorST).innerHTML = actual;

        var textShadow1, textShadow2;
        textShadow1 = '#fff 0 0 ' + (actual / 10 * 2) + 'px'; // Sombra más débil
        textShadow2 = '#fcffbb 0 0 ' + (actual / 10 * 5) + 'px'; // Sombra más fuerte

        var lightElement = document.getElementById('light');
        lightElement.style.textShadow = textShadow1 + ', ' + textShadow2;
    });
}

function actualizarProximidad() {

    var sensorST = "Proximidad";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {

        var actual = valor[valor.length - 1].datos;

        guardarDatos(sensorST, valor);

        if(actualizado[sensorST]){

            actualizado[sensorST] = !actualizado[sensorST];
            preparacionDatos(sensorST);

        }else{
            actualizarGrafica();
        }

        document.getElementById("actual-" + sensorST).innerHTML = actual;

        if (actual < 3) {
            distancia = 1;
        } else {
            distancia = 0;
        }
    });
}

function actualizarGPS() {

    var sensorST = "GPS";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {

        map.remove(miPosicion);

        const positionFeature = new ol.Feature();

        var coordinates = [valor[valor.length - 1].datos[1], valor[valor.length - 1].datos[0]];

        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
        positionFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#3399CC',
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        }));

        map.getView().setCenter(coordinates);

        miPosicion = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [positionFeature],
            }),
        });

        map.addLayer(miPosicion);

        document.getElementById("actual-GPS-x").innerHTML = coordinates[0];
        document.getElementById("actual-GPS-y").innerHTML = coordinates[1];
    });
}

//Gráficas

function creacionGrafica(data, sensorST){
    const config = {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            type: "time",
            title: {
                display: true,
                text: 'Fecha recogida de datos'
            },
            time: {
                unit: 'second',
                stepSize: actualizacion[sensorST]
            },
            ticks: {
                display: true,
                source: 'auto'
            }
          },
          y: {
            title: {
              display: true,
              text: unidades[sensorST]
            }
          }
        }
      },
    };

    var myChart = new Chart(document.getElementById("grafica-" + sensorST), config);
    myChart.canvas.parentNode.style.width = '100%';
    graficas[sensorST] = myChart;
}

function preparacionClima(){

    const data_pre = datos["Termometro"];
    const data_hum = datos["Humedad"];
    const data_tem = datos["Barometro"];
    const data_x = fechas["Termometro"];

    var r = 0;
    var g = 255;
    var b = 0;
    var datasets = [];

    var nombre1 = "Temperatura";
    var nombre2 = "Humedad";
    var nombre3 = "Presión";


    datasets = [{
        label: nombre1,
        backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
        borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
        data: data_tem,
        spanGaps: true
    },
    {
        label: nombre2,
        backgroundColor: 'rgb(' + g + ',' + r + ',' + b + ')',
        borderColor: 'rgb(' + g + ',' + r + ',' + b + ')',
        data: data_hum,
        spanGaps: true
    },
    {
        label: nombre3,
        backgroundColor: 'rgb(' + r + ',' + b + ',' + g + ')',
        borderColor: 'rgb(' + r + ',' + b + ',' + g + ')',
        data: data_pre,
        spanGaps: true
    }]


    const data = {
        labels: data_x,
        datasets: datasets
    };

    creacionGrafica(data, "Clima");
}

function preparacionDatos(sensorST){

    const data_y = datos[sensorST];
    const data_x = fechas[sensorST];

    var r = 0;
    var g = 255;
    var b = 0;
    var datasets = [];

    if(uniVariable[sensorST]) {
        for(var i = 0; i < data_x.length; i++)
            data_y[i] = data_y[i][0];
        datasets = [{
            label: sensorST,
            backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            data: data_y,
            spanGaps: true,
        }]
    }else {

        var data1_y = [];
        var data2_y = [];
        var data3_y = [];

        var nombre1 = "Eje X";
        var nombre2 = "Eje Y";
        var nombre3 = "Eje Z";

        for (var i = 0; i < data_y.length; i++) {
            data1_y.push(data_y[0][0]);
            data2_y.push(data_y[0][1]);
            data3_y.push(data_y[0][2]);
        }

        datasets = [{
            label: nombre1,
            backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            data: data1_y,
            spanGaps: true
        },
            {
                label: nombre2,
                backgroundColor: 'rgb(' + g + ',' + r + ',' + b + ')',
                borderColor: 'rgb(' + g + ',' + r + ',' + b + ')',
                data: data2_y,
                spanGaps: true
            },
            {
                label: nombre3,
                backgroundColor: 'rgb(' + r + ',' + b + ',' + g + ')',
                borderColor: 'rgb(' + r + ',' + b + ',' + g + ')',
                data: data3_y,
                spanGaps: true
            }]
    }


    const data = {
        labels: data_x,
        datasets: datasets
    };

    creacionGrafica(data, sensorST);

}

function actualizarGrafica(sensor){

    var myChart = graficas[sensor];

    myChart.config.data.labels = fechas[sensor];

    if(!uniVariable[sensorST]){

        var data_x = [];
        var data_y = [];
        var data_z = [];

        for(var i = 0; i < valor[sensor].length; i++){
            data_x.push(valor[sensor][i][0]);
            data_y.push(valor[sensor][i][1]);
            data_z.push(valor[sensor][i][2]);
        }

        myChart.config.data.datasets[0].data = data_x;
        myChart.config.data.datasets[1].data = data_y;
        myChart.config.data.datasets[2].data = data_z;

    }else{

        myChart.config.data.datasets[0].data = valor[sensor];

    }

    myChart.update();

}

function actualizarGraficaClima(){

    var myChart = graficas["Clima"];

    myChart.config.data.labels = fechas["Termometro"];

    var data_tem = valor["Termometro"];
    var data_hum = valor["Humedad"];
    var data_pre = valor["Barometro"];

    myChart.config.data.datasets[0].data = data_tem;
    myChart.config.data.datasets[1].data = data_hum;
    myChart.config.data.datasets[2].data = data_pre;

    myChart.update();

}

//Control de los sensores encendidos

async function encendidos(){

    var total = 0;

    for(var i = 0; i < todosSensores.length; i++){
        sensorST = todosSensores[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        try {
            var data = await $.ajax({
                url: '/' + sensorST,
                type: 'GET'
            });
            if(data.length > 0) {

                var actual = new Date();
                var ultima = new Date(data[data.length - 1].fecha);

                var diferenciaMilisegundos = actual.getTime() - ultima.getTime();
                if (todosSensores[i] === "Humedad" || todosSensores[i] === "Termometro" || todosSensores[i] === "Barometro") {
                    if (Math.abs(diferenciaMilisegundos) <= actualizacion["Clima"])
                        total++;
                } else {
                    if (Math.abs(diferenciaMilisegundos) <= actualizacion[todosSensores[i]])
                        total++;
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    document.getElementById("encendido").style.color = "green";
    if(total === 0)
        document.getElementById("encendido").style.color = "red";
    else if(total === 1)
        document.getElementById("encendido").innerHTML = total + " sensor se encuentra activo";
    else
        document.getElementById("encendido").innerHTML = total + " sensores se encuentran activos";
}