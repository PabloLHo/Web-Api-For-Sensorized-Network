var graficas = {};
var sensorEncendido = {"Podometro": 0, "Bateria": 0,"Giroscopio": 0, "Magnetometro": 0, "Acelerometro": 0, "Proximidad": 0, "Luminosidad": 0, "Clima": 0};
var valor;
var datos = {"Podometro": [], "Bateria": [],"Giroscopio": [], "Magnetometro": [], "Acelerometro": [], "Proximidad": [], "Luminosidad": [], "Termometro": [], "Barometro": [], "Humedad": []};
var sensores = ["Podometro", "Bateria", "Giroscopio", "Magnetometro", "Acelerometro", "Proximidad", "Luminosidad", "GPS", "Clima"];
var todosSensores = ["Podometro", "Bateria", "Giroscopio", "Magnetometro", "Acelerometro", "Proximidad", "Luminosidad", "GPS", "Barometro", "Termometro", "Humedad"];
var uniVariable = {"Podometro": true, "Bateria": true,"Giroscopio": false, "Magnetometro": false, "Acelerometro": false, "Proximidad": true, "Luminosidad": true, "Clima": false}
var actualizacion = {"Podometro": 90000, "Bateria": 120000,"Giroscopio": 30000, "Magnetometro": 60000, "Acelerometro": 15000, "Proximidad": 15000, "Luminosidad": 30000,"GPS": 90000, "Clima": 600000};
var unidades = { "Podometro": "Pasos", "Bateria": "%","Giroscopio": "Radianes / s", "Magnetometro": "µT", "Acelerometro": 'm / s', "Proximidad": "cm", "Luminosidad": "lx", "Clima": ["hPa", "ºC", "%"] }
var tpGrafica = { "Bateria": "","Giroscopio": "", "Magnetometro": "", "Acelerometro": '', "Proximidad": "", "Luminosidad": "", "Clima": "" }


function onload() {

    valor = sensor;

    encendidos();

    window.setInterval(encendidos,2000);

    if(valor === "Batería")
        document.getElementById("indicadorBateria").style.display = "none";
    else if(valor !== "Todos") {
        actualizarMiniBateria();
        window.setInterval(window["actualizarMiniBateria"], actualizacion["Bateria"]);
    }

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

    datos[sensorST].length = 0;

    for(var i = 0; i < data.length; i++){
        datos[sensorST].push(data[i]);
    }

}

function actualizarAcelerometro(){

    var sensorST = "Acelerometro";
    console.log("Actualizando " + sensorST);

    var data = obtenerDatos(sensorST);
    data.then((valor) => {
        if(valor.length > 0) {

            var actual = valor[valor.length - 1].datos;

            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            var numero_x = actual[0];
            var numero_y = actual[1];
            var numero_z = actual[2];


            giro_x = 60 + Math.abs(numero_x) * 14.5;
            giro_y = 60 + Math.abs(numero_y) * 14.5;
            giro_z = 60 + Math.abs(numero_z) * 14.5;

            document.getElementById("actual-" + sensorST + "-x").innerHTML = numero_x.toFixed(2);
            document.getElementById("actual-" + sensorST + "-y").innerHTML = numero_y.toFixed(2);
            document.getElementById("actual-" + sensorST + "-z").innerHTML = numero_z.toFixed(2);
            document.getElementById("dash").style.transform = "rotate(" + giro_x + "deg)";
            document.getElementById("dash-y").style.transform = "rotate(" + giro_y + "deg)";
            document.getElementById("dash-z").style.transform = "rotate(" + giro_z + "deg)";
        }
    });

}

function actualizarBateria() {

    var sensorST = "Bateria";
    var data = obtenerDatos(sensorST);


    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;
            var bateria = actual[0];

            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            var root = document.documentElement;
            root.style.setProperty('--carga', bateria + '%');

            if (bateria > 40)
                root.style.setProperty('--color-carga', "lime");
            else
                root.style.setProperty('--color-carga', "orange");
        }
    });
}

function actualizarGiroscopio() {

    var sensorST = "Giroscopio";
    var data = obtenerDatos(sensorST);
    console.log("Actualizando " + sensorST);

    data.then((valor) => {
        console.log(valor);
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;


            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            var numero_x = actual[0] * 180 / Math.PI;
            var numero_y = actual[1] * 180 / Math.PI;
            var numero_z = actual[2] * 180 / Math.PI;

            document.getElementById("actual-" + sensorST + "-x").innerHTML = numero_x.toFixed(2);
            document.getElementById("actual-" + sensorST + "-y").innerHTML = numero_y.toFixed(2);
            document.getElementById("actual-" + sensorST + "-z").innerHTML = numero_z.toFixed(2);

            var elementoX = document.querySelector('.total-x');
            elementoX.style.transform = 'rotateX(' + numero_x + 'deg)';

            var elementoY = document.querySelector('.total-y');
            elementoY.style.transform = 'rotateY(' + numero_y + 'deg)';

            var elementoZ = document.querySelector('.total-z');
            elementoZ.style.transform = 'rotateZ(' + numero_z + 'deg)';
        }
    });
}

function actualizarMagnetometro() {

    var sensorST = "Magnetometro";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;

            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            var numero_x = actual[0];
            var numero_y = actual[1];
            var numero_z = actual[2];

            document.getElementById("actual-" + sensorST + "-x").innerHTML = numero_x.toFixed(2);
            document.getElementById("actual-" + sensorST + "-y").innerHTML = numero_y.toFixed(2);
            document.getElementById("actual-" + sensorST + "-z").innerHTML = numero_z.toFixed(2);

            var absoluto = Math.sqrt(Math.pow(numero_x, 2) + Math.pow(numero_y, 2) + Math.pow(numero_z, 2));

            document.getElementById("text-magnetometro").innerHTML = absoluto.toFixed(2) + "&microT";

            var radianes = Math.atan2(actual[1], actual[0]);
            var grados = radianes * 180 / Math.PI;
            document.getElementById("img_brujula").style.transform = "rotate(" + grados + "deg)";
        }
    });
}

function actualizarClima() {

    var sensorST = "Clima";
    console.log("Actualizando " + sensorST);

    var dataTemp = obtenerDatos("Termometro");
    var dataHum = obtenerDatos("Humedad");
    var dataPre = obtenerDatos("Barometro");

    dataTemp.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;
            document.getElementById("actual-Temperatura").innerHTML = actual;

            guardarDatos("Termometro", valor);
        }

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


}

function actualizarPodometro() {
    var sensorST = "Podometro";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;

            document.getElementById("actual-" + sensorST).innerHTML = actual;
            document.getElementById("actual-distancia").innerHTML = actual * 0.7;

            guardarDatos(sensorST, valor);
        }

    });
}

function actualizarLuminosidad() {

    var sensorST = "Luminosidad";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos[0];

            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            document.getElementById("actual-" + sensorST).innerHTML = actual;

            var textShadow1, textShadow2;
            textShadow1 = '#fff 0 0 ' + (actual / 20000 * 2) + 'px'; // Sombra más débil
            textShadow2 = '#fcffbb 0 0 ' + (actual / 20000 * 5) + 'px'; // Sombra más fuerte

            var lightElement = document.getElementById('light');
            lightElement.style.textShadow = textShadow1 + ', ' + textShadow2;
        }
    });
}

function actualizarProximidad() {

    var sensorST = "Proximidad";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;

            guardarDatos(sensorST, valor);

            setGrafica(tpGrafica[sensorST], sensorST);

            document.getElementById("actual-" + sensorST).innerHTML = actual;

            if (actual < 3) {
                distancia = 1;
            } else {
                distancia = 0;
            }
        }
    });
}

function actualizarGPS() {

    var sensorST = "GPS";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            map.removeLayer(miPosicion);

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

            if(seguimientoActivo())
                crearSeguimiento();
        }
    });
}

async function obtenerCoordenadas(){

    var valor = await obtenerDatos("GPS");
    if(valor.length > 0) {
        var coordinates = [];

        coordinates.push([valor[valor.length - 1].datos[1], valor[valor.length - 1].datos[0]]);

        for(var i = valor.length - 2; i >= 0; i--){
            var fecha = new Date(valor[i].fecha);
            var fechaAnterior = new Date(valor[i + 1].fecha);

            if( (fechaAnterior.getTime() -  fecha.getTime()) <= (actualizacion["GPS"] + 5000))
                coordinates.push([valor[i].datos[1], valor[i].datos[0]]);
            else
                break;
        }

        return coordinates;
    }
}

function actualizarMiniBateria(){

    var sensorST = "Bateria";
    var data = obtenerDatos(sensorST);

    data.then((valor) => {
        if(valor.length > 0) {
            var actual = valor[valor.length - 1].datos;
            var bateria = actual[0];

            var root = document.documentElement;
            root.style.setProperty('--carga', bateria + '%');

            if (bateria > 40)
                root.style.setProperty('--color-carga', "lime");
            else
                root.style.setProperty('--color-carga', "orange");
        }
    });
}

//Gráficas

function setGrafica(tipo, sensor){

    var data = [];
    var fechas = [];

    var myChart = graficas[sensor];

    var fecha;
    var fechaIni;

    if(myChart){

        fecha = new Date(myChart.config.data.labels[0]);
        var ultimaFecha = new Date(datos[sensor][datos[sensor].length - 1].fecha);

        if(fecha.getTime() === ultimaFecha.getTime())
            return;

    }


    fecha = new Date(datos[sensor][datos[sensor].length - 1].fecha);
    fechaIni = fecha;
    if(tipo === "TR")
        fechaIni = sensorEncendido[sensor];
    else if (tipo === "UD")
        fechaIni.setHours(fechaIni.getDay() - 1);
    else
        fechaIni.setMinutes(fechaIni.getHours() - 1);


    for(var i = 0; i < datos[sensor].length; i++){
        fecha = new Date(datos[sensor][i].fecha)
        if(fecha.getTime() >= fechaIni.getTime()){
            data.push(datos[sensor][i].datos);
            fechas.push(fecha);
        }
    }


    var color = [0,255,0];
    var datasets = [];

    if(uniVariable[sensor]) {

        for(var i = data.length - 1; i >= 0; i--) {
            data[i] = data[i][0];
        }

        datasets = [{
            label: sensorST,
            backgroundColor: 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
            borderColor: 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
            data: data,
            spanGaps: true,
        }]

    }else {

        var data_x = [];
        var data_y = [];
        var data_z = [];

        for(var i = 0; i < data.length; i++) {
            data_x.push(data[i][0]);
            data_y.push(data[i][1]);
            data_z.push(data[i][2]);
        }


        datasets = [{
            label: "Eje x",
            backgroundColor: 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
            borderColor: 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
            data: data_x,
            spanGaps: true
        },
        {
            label: "Eje Y",
            backgroundColor: 'rgb(' + color[1] + ',' + color[0] + ',' + color[2] + ')',
            borderColor: 'rgb(' + color[1] + ',' + color[0] + ',' + color[2] + ')',
            data: data_y,
            spanGaps: true
        },
        {
            label: "Eje Z",
            backgroundColor: 'rgb(' + color[0] + ',' + color[2] + ',' + color[1] + ')',
            borderColor: 'rgb(' + color[0] + ',' + color[2] + ',' + color[1] + ')',
            data: data_z,
            spanGaps: true
        }]

    }

    const config = {
      type: 'line',
      data: {
          labels: fechas,
          datasets: datasets
      },
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
                displayFormats: {
                        second: 'h:mm:ss a' // Formato de visualización del tiempo en el eje x
                },
                stepSize: actualizacion[sensor] / 1000
            },
            ticks: {
                display: true,
                source: 'auto',
                autoSkipPadding: 10
            }
          },
          y: {
            title: {
              display: true,
              text: unidades[sensor]
            }
          }
        }
      },
    };

    if(sensor === "Bateria"){
        config.options.scales.y.max = 100;
        config.options.scales.y.min = 0;
    }

    myChart = new Chart(document.getElementById("grafica-" + sensor), config);
    myChart.canvas.parentNode.style.width = '100%';
    graficas[sensor] = myChart;
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
                var elemento = document.getElementById("TR-" + todosSensores[i]);
                if (todosSensores[i] === "Humedad" || todosSensores[i] === "Termometro" || todosSensores[i] === "Barometro") {
                    if (Math.abs(diferenciaMilisegundos) <= (actualizacion["Clima"] + 10000 )) {
                        if(sensorEncendido["Clima"] !== 0)
                            sensorEncendido["Clima"] = actual;
                        total++;
                    }else
                        sensorEncendido["Clima"] = 0;
                } else {
                    if (Math.abs(diferenciaMilisegundos) <= (actualizacion[todosSensores[i]] + 10000)) {
                        if(sensorEncendido[todosSensores[i]] === 0) {
                            sensorEncendido[todosSensores[i]] = actual;
                            if(elemento !== null)
                                elemento.style.display = "block";
                        }
                        total++;
                    }else {
                        sensorEncendido[todosSensores[i]] = 0;
                        if(elemento !== null)
                                elemento.style.display = "block";
                    }

                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.getElementById("encendido").style.color = "green";
    if(total === 0) {
        document.getElementById("encendido").style.color = "red";
    }
    if(total === 1)
        document.getElementById("encendido").innerHTML = total + " sensor se encuentra activo";
    else
        document.getElementById("encendido").innerHTML = total + " sensores se encuentran activos";
}