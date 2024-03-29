var seguimiento = false;
var historial = false;
var posiciones = false;
var lineLayer;
var historyLayer = [];
var posicionesV = [];

function crearMapa(){
	var lyrSatelite = new ol.layer.Tile({
		title: 'Satelite',
		type: 'base',
		preload: 10,
		visible: true,
		source:new ol.source.XYZ({
			url:'http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
		})
	})

	var lyrTerrain = new ol.layer.Tile({
		title: "Cartografía",
		type: 'base',
		visible: false,
		source: new ol.source.OSM(),
	})

	var grupoBase = new ol.layer.Group({
		title: 'Mapas base',
		layers: [
			lyrTerrain,
			lyrSatelite
		]
	})

	const projection = ol.proj.get("EPSG:4326");
	const view = new ol.View({
		center: [37.77, -3.901],
		zoom: 15,
		projection: projection,
		minZoom: 5,
	});

	map = new ol.Map({
		target: 'map',
		layers: [
			grupoBase
		],
		view: view,
	});

	var layerSwitcher = new ol.control.LayerSwitcher({
		activationMode: 'click',
		groupSelectStyle: 'none' // Can be 'children' [default], 'group' or 'none'
	});


	map.addControl(layerSwitcher);

	var mousePosition = new ol.control.MousePosition({
		className: 'mousePosition',
		projection: "EPSG:4326",
		coordinateFormat: function(coordinate){
			return ol.coordinate.format(coordinate, '{x} , {y}',6);
		}
	});

	map.addControl(mousePosition);

	var boton2 = document.createElement('button');
	var icono2 = document.createElement('i');
	icono2.className = 'fa fa-road';
	icono2.style.cursor = 'pointer';
	boton2.innerHTML = "";
	boton2.appendChild(icono2);
	boton2.title = "Seguimiento"

	boton2.addEventListener('click', function () {
		if(!seguimiento){
			boton2.style.color = '#000000';
			boton.style.color = '#ffffff';
			for(var i = 0; i < historyLayer.length; i++)
				map.removeLayer(historyLayer[i]);
			historial = false;
			crearSeguimiento();
		}else{
			document.getElementById("sinRecorrido").style.display = "none";
			boton2.style.color = '#ffffff';
			map.removeLayer(lineLayer);
		}
		seguimiento = !seguimiento;
	});

	var elementoDiv2 = document.createElement('div');
	elementoDiv2.className = 'ol-unselectable ol-control';
	elementoDiv2.appendChild(boton2);
	elementoDiv2.style.top = "8.5px";
	elementoDiv2.style.right = ".5em";
	var NuevoControl2 = new ol.control.Control({ element: elementoDiv2 });
	map.addControl(NuevoControl2);

	var boton = document.createElement('button');
	var icono = document.createElement('i');
	icono.className = 'fa fa-history';
	icono.style.cursor = 'pointer';
	boton.innerHTML = "";
	boton.appendChild(icono);
	boton.title = "Historial recorridos"

	boton.addEventListener('click', function () {
		if(!historial){
			boton.style.color = '#000000';
			boton2.style.color = '#ffffff';
			seguimiento = false;
			map.removeLayer(lineLayer);
			crearHistorial();
		}else{
			boton.style.color = '#ffffff';
			for(var i = 0; i < historyLayer.length; i++)
				map.removeLayer(historyLayer[i]);
		}
		historial = !historial;
	});

	var elementoDiv = document.createElement('div');
	elementoDiv.className = 'ol-unselectable ol-control';
	elementoDiv.appendChild(boton);
	elementoDiv.style.top = "8.5px";
	elementoDiv.style.right = "3.5em";
	var NuevoControl = new ol.control.Control({ element: elementoDiv });
	map.addControl(NuevoControl);

	var boton3 = document.createElement('button');
	var icono3 = document.createElement('i');
	icono3.className = 'fa fa-dot-circle-o';
	icono3.style.cursor = 'pointer';
	boton3.innerHTML = "";
	boton3.appendChild(icono3);
	boton3.title = "Historial posiciones"

	boton3.addEventListener('click', function () {
		if(!posiciones){
			boton3.style.color = '#000000';
			crearHistorialPos();
		}else{
			boton3.style.color = '#ffffff';
			for(var i = 0; i < posicionesV.length; i++)
				map.removeLayer(posicionesV[i]);
		}
		posiciones = !posiciones;
	});

	var elementoDiv3 = document.createElement('div');
	elementoDiv3.className = 'ol-unselectable ol-control';
	elementoDiv3.appendChild(boton3);
	elementoDiv3.style.top = "8.5px";
	elementoDiv3.style.right = "6.5em";
	var NuevoControl3 = new ol.control.Control({ element: elementoDiv3 });
	map.addControl(NuevoControl3);
}

async function crearSeguimiento(){

	map.removeLayer(lineLayer);
	var coordinates = await obtenerCoordenadas(false);


	if(coordinates.length < 2){

		document.getElementById("sinRecorrido").style.display = "block";
		document.getElementById("sinRecorrido").innerHTML = "En el ultimo periodo solo hay un dato, no hay recorrido posible";

	}else {


		var lineStringFeature = new ol.Feature({
			geometry: new ol.geom.LineString(coordinates)
		});

		var startMarker = new ol.Feature({
			geometry: new ol.geom.Point(coordinates[0])
		});

		var endMarker = new ol.Feature({
			geometry: new ol.geom.Point(coordinates[coordinates.length - 1])
		})

		lineLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [
					lineStringFeature,
					startMarker,
					endMarker,
				]
			})
		});

		// Crear un estilo para los marcadores
		var startMarkerStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: 'static/img/icon.png',
			}),
		});

		var endMarkerStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: 'static/img/icon2.png',
			}),
		});

		// Aplicar el estilo a los marcadores
		startMarker.setStyle(startMarkerStyle);
		endMarker.setStyle(endMarkerStyle);

		var lineStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'blue', // Color de la línea
				width: 3 // Anchura de la línea
			})
		});

		// Aplicar el estilo a la característica de la polilínea
		lineStringFeature.setStyle(lineStyle);

		map.addLayer(lineLayer);
	}
}

function seguimientoActivo() {
	return seguimiento;
}

async function crearHistorial(){

	for(var i = 0; i < historyLayer.length; i++)
		map.removeLayer(historyLayer[i]);

	var coordinates = await obtenerCoordenadas(true);


	coordinates.forEach(function(route) {

		var lineStringFeature = new ol.Feature({
			geometry: new ol.geom.LineString(route)
		});

		var startMarker = new ol.Feature({
			geometry: new ol.geom.Point(route[0])
		});

		var endMarker = new ol.Feature({
			geometry: new ol.geom.Point(route[route.length - 1])
		});

		layer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [
					lineStringFeature,
					startMarker,
					endMarker,
				]
			})
		});

		historyLayer.push(layer);

		// Crear un estilo para los marcadores
		var startMarkerStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: 'static/img/icon.png',
			}),
		});

		var endMarkerStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: 'static/img/icon2.png',
			}),
		});

		// Aplicar el estilo a los marcadores
		startMarker.setStyle(startMarkerStyle);
		endMarker.setStyle(endMarkerStyle);

		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);

		// Construir el color RGB
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';

		var lineStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: color, // Usar el color especificado en la ruta
				width: 3 // Anchura de la línea
			})
		});

		// Aplicar el estilo a la característica de la polilínea
		lineStringFeature.setStyle(lineStyle);

		map.addLayer(layer);
	});
}

async function crearHistorialPos(){

	var valor = await obtenerDatos("GPS");

	for(var i = 0; i < valor.length; i++){
		const positionFeature = new ol.Feature();

		var coordinates = [valor[i].datos[1], valor[i].datos[0]];

		positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
		positionFeature.setStyle(new ol.style.Style({
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: "red",
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 2,
				}),
			}),
		}));

		miPosicion = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [positionFeature],
			}),
		});

		map.addLayer(miPosicion);

		posicionesV.push(miPosicion);

	}


}