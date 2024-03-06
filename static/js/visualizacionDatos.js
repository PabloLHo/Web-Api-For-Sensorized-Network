var graficas = {};
var valor;
var sensores = ["Podómetro", "Batería", "Giroscopio", "Magnetómetro", "Acelerómetro", "Proximidad", "Luminosidad", "GPS", "Temperatura"];
var actualizacion = {"Podómetro": 90000, "Batería": 120000,"Giroscopio": 30000, "Magnetómetro": 60000, "Acelerómetro": 15000, "Proximidad": 15000, "Luminosidad": 30000,"GPS": 90000, "Temperatura": 600000};

function onload() {

    valor = sensor;
    console.log(valor);
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

            if(sensores[i] === "Temperatura"){
                inicializar("Barometro");
                crearGrafica("Barometro");
                inicializar("Termometro");
                crearGrafica("Termometro");
                inicializar("Humedad");
                crearGrafica("Humedad");
            }else {
                inicializar(sensorST.toLowerCase());
                crearGrafica(sensores[i]);
            }

            window.setInterval(window["actualizar" + sensorST], actualizacion[sensores[i]]);

        }

    } else {

        document.getElementById(valor).style.display = "block";
        sensorST = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        inicializar(sensorST.toLowerCase());
        crearGrafica(valor);
        window.setInterval(window["actualizar" + sensorST], actualizacion[valor]);

    }

    if(valor === "GPS")
        crearMapa();

}

function inicializar(s){
    $.ajax({
            url: '/' + s,
            type: 'GET',
            success: function(data) {
                document.getElementById("actual-" + s).innerHTML = "0";
                console.log("correcto");
            },
            error: function(error) {
                console.error('Error:', error);
            }
    });
}

function crearGrafica(sensor){

    const data2 = [];
    const fechas = [];

    for (var i = 0; i < 1; i++) {
        data2.push(Math.random());
        fechas.push(i)
    }

    var r = 0;
    var g = 255;
    var b = 0;

    const data = {
        labels: fechas,
        datasets: [{
            label: sensor,
            backgroundColor: 'rgb(' + r + ',' + g + ',' + b +')',
            borderColor: 'rgb(' + r + ',' + g + ',' + b +')',
            data: data2,
        }]
    };

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
                unit: 'month',
                stepSize: 1
            },
            ticks: {
                display: true,
                source: 'auto'
            }
          },
          y: {
            title: {
              display: true,
              text: ""
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

function actualizarAcelerometro(){
    var numero_x = Math.random() * 4;
    var numero_y = Math.random() * 4;
    var numero_z = Math.random() * 4;
    actualizarGrafica("Acelerómetro");
    giro_x = 60 + numero_x * 57.5;
    giro_y = 60 + numero_y * 57.5;
    giro_z = 60 + numero_z * 57.5;
    document.getElementById("actual-" + valor + "-y").innerHTML = numero_y.toFixed(2);
    document.getElementById("actual-" + valor + "-z").innerHTML = numero_z.toFixed(2);
    document.getElementById("dash").style.transform = "rotate(" + giro_x + "deg)";
    document.getElementById("dash-y").style.transform = "rotate(" + giro_y + "deg)"
    document.getElementById("dash-z").style.transform = "rotate(" + giro_z + "deg)"
}

function actualizarBateria() {

}

function actualizarGiroscopio() {

}

function actualizarMagnetometro() {

}

function actualizarTemperatura() {

}

function actualizarPodometro() {

}

function actualizarLuminosidad() {

}

function actualizarProximidad() {

}

function actualizarGPS() {

}