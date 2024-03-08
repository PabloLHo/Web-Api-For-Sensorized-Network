var graficas = {};
var valor;
var datos = {"Podometro": [], "Bateria": [],"Giroscopio": [], "Magnetometro": [], "Acelerometro": [], "Proximidad": [], "Luminosidad": [], "Temperatura": [], "Barometro": [], "Humedad": []};
var fechas = {"Podometro": [], "Bateria": [],"Giroscopio": [], "Magnetometro": [], "Acelerometro": [], "Proximidad": [], "Luminosidad": [], "Temperatura": [], "Barometro": [], "Humedad": []};
var sensores = ["Podómetro", "Batería", "Giroscopio", "Magnetómetro", "Acelerómetro", "Proximidad", "Luminosidad", "GPS", "Clima"];
var uniVariable = {"Podómetro": true, "Batería": true,"Giroscopio": false, "Magnetómetro": false, "Acelerómetro": false, "Proximidad": true, "Luminosidad": true, "Clima": false}
var actualizacion = {"Podómetro": 90000, "Batería": 120000,"Giroscopio": 30000, "Magnetómetro": 60000, "Acelerómetro": 15000, "Proximidad": 15000, "Luminosidad": 30000,"GPS": 90000, "Clima": 600000};
var unidades = { "Podómetro": "Pasos", "Batería": "%","Giroscopio": "Radianes / s", "Magnetómetro": "µT", "Acelerómetro": 'm / s', "Proximidad": "cm", "Luminosidad": "lx", "Clima": ["hPa", "ºC", "%"] }


function onload() {

    valor = sensor;

    if(sensoresEncendidos.length === 0)
        document.getElementById("encendido").style.color = "red";

    document.getElementById("encendido").innerHTML = sensoresEncendidos.length + " sensores se encuentran encendidos";

    if(valor === "Batería")
        document.getElementById("indicadorBateria").style.display = "none";

    if (valor === "Todos") {

        document.getElementById("titulo").innerHTML = "Todos los sensores";
        for (var i = 0; i < sensores.length; i++) {

            document.getElementById(sensores[i]).style.display = "block";
            sensorST = sensores[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if(sensores[i] === "Clima"){
                inicializar("Barometro", true);
                inicializar("Temperatura", true);
                inicializar("Humedad", true);
                setTimeout(function() {
                    graficaClima(); }, 2000);
            }else if(sensores[i] === "GPS"){
                inicializaGPS();
            }else{
                inicializar(sensorST, uniVariable[valor]);
                setTimeout(function() {
                        crearGrafica(valor, sensorST, uniVariable[valor]);
                    }, 2000);
            }

            window.setInterval(window["actualizar" + sensorST], actualizacion[sensores[i]]);

        }

    } else {

        document.getElementById(valor).style.display = "block";
        sensorST = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if(valor === "Clima"){
            inicializar("Barometro", true);
            inicializar("Temperatura", true);
            inicializar("Humedad", true);
            setTimeout(function() {
                    graficaClima(); }, 2000);
        }else if( valor === "GPS"){
            inicializaGPS();
        }else{
            inicializar(sensorST, uniVariable[valor]);
            setTimeout(function() {
                crearGrafica(valor, sensorST, uniVariable[valor]); }, 2000);
        }

        //window.setInterval(window["actualizar" + sensorST], actualizacion[valor]);

    }

    if(valor === "GPS" || valor === "Todos")
        crearMapa();

}

function inicializaGPS(){
    $.ajax({
            url: '/GPS',
            type: 'GET',
            success: function(data) {
                console.log(data);

                const positionFeature = new ol.Feature();
                var coordinates = [data[data.length - 1].datos[1], data[data.length - 1].datos[0]];
                console.log(coordinates);
                positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
                positionFeature.setStyle(
                    new ol.style.Style({
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
                    })
                );
                map.getView().setCenter(coordinates);
                miPosicion = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [positionFeature],
                    }),
                });

                map.addLayer(miPosicion);
                console.log("Recogida inicial correcta para el GPS");
            },
            error: function(error) {
                console.error('Error:', error);
            }
    });
}

function inicializar(s, uniVariable){
    $.ajax({
            url: '/' + s,
            type: 'GET',
            success: function(data) {
                console.log(data);

                for(var i = 0; i < data.length; i++){
                    datos[s].push(data[i].datos);

                    const date = new Date(data[i].fecha);
                    fechas[s].push(date.getTime());
                }
                if(!uniVariable){
                    document.getElementById("actual-" + s + "-x").innerHTML = data[data.length - 1].datos[0].toFixed(2);
                    document.getElementById("actual-" + s + "-y").innerHTML = data[data.length - 1].datos[1].toFixed(2);
                    document.getElementById("actual-" + s + "-z").innerHTML = data[data.length - 1].datos[2].toFixed(2);
                }else
                    document.getElementById("actual-" + s).innerHTML = data[data.length - 1].datos[0].toFixed(2);

                console.log("Recogida inicial correcta para " + s);
                window["actualizar" + sensorST](sensorST);
            },
            error: function(error) {
                console.error('Error:', error);
            }
    });
}

function graficaClima(){

}

function crearGrafica(sensor, sensorST, uniVariable){

    const data_y = datos[sensorST];
    const data_x = fechas[sensorST];

    var r = 0;
    var g = 255;
    var b = 0;
    var datasets = [];

    if(uniVariable) {
        for(var i = 0; i < data_x.length; i++)
            data_y[i] = data_y[i][0];
        datasets = [{
            label: sensor,
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
    console.log(data_x);
    console.log(data_y);
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
                stepSize: actualizacion[sensor]
            },
            ticks: {
                display: true,
                source: 'auto'
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

    var myChart = new Chart(document.getElementById("grafica-" + sensor), config);
    myChart.canvas.parentNode.style.width = '100%';
    graficas[sensor] = myChart;

}

function actualizarGrafica(sensor){
    document.getElementById("actual-" + sensor).innerHTML = 0;
    var myChart = graficas[sensor];
    myChart.config.data.labels.push(myChart.config.data.labels[myChart.config.data.labels.length - 1] + 1);
    myChart.config.data.datasets[0].data.push(0);
    myChart.update();
}

function actualizarAcelerometro(sensorST){
    var actual = datos[sensorST][datos[sensorST].length - 1];
    var numero_x = actual[0];
    var numero_y = actual[1];
    var numero_z = actual[2];
    //actualizarGrafica("Acelerómetro");
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

function actualizarBateria(sensorST) {
    var actual = datos[sensorST][datos[sensorST].length - 1];
    var bateria = actual[0];
    var root = document.documentElement;
    root.style.setProperty('--carga', bateria + '%');
    if(bateria > 40)
        root.style.setProperty('--color-carga', "lime");
    else
        root.style.setProperty('--color-carga', "orange");

}

function actualizarGiroscopio(sensorST) {
    var actual = datos[sensorST][datos[sensorST].length - 1];
    var numero_x = actual[0] * 180 / Math.PI;
    var numero_y = actual[1] * 180 / Math.PI;
    var numero_z = actual[2] * 180 / Math.PI;
    //actualizarGrafica("Acelerómetro");

    var elementoX = document.querySelector('.total-x');
    elementoX.style.transform = 'rotateX(' + numero_x + 'deg)';
    var elementoY = document.querySelector('.total-y');
    elementoY.style.transform = 'rotateY(' + numero_x + 'deg)';
    var elementoZ = document.querySelector('.total-z');
    elementoZ.style.transform = 'rotateZ(' + numero_x + 'deg)';
}

function actualizarMagnetometro() {

}

function actualizarTemperatura() {

}

function actualizarPodometro() {

}

function actualizarLuminosidad(sensorST) {
    var actual = datos[sensorST][datos[sensorST].length - 1][0];

    document.getElementById("actual-" + sensorST).innerHTML = actual;

    var textShadow1, textShadow2;
    textShadow1 = '#fff 0 0 ' + (actual / 10 * 2) + 'px'; // Sombra más débil
    textShadow2 = '#fcffbb 0 0 ' + (actual / 10 * 5) + 'px'; // Sombra más fuerte

    var lightElement = document.getElementById('light');
    lightElement.style.textShadow = textShadow1 + ', ' + textShadow2;
}

function actualizarProximidad(sensorST) {
    var actual = datos[sensorST][datos[sensorST].length - 1];
    document.getElementById("actual-" + sensorST).innerHTML = actual;
    if(actual < 3){
        distancia = 1;
    }else{
        distancia = 0;
    }
}

function actualizarGPS() {

}