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

	const view = new ol.View({
		center: [-420000, 4550000],
		zoom: 15,
	});

	const map = new ol.Map({
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
		projection: "EPSG:3857",
		coordinateFormat: function(coordinate){
			return ol.coordinate.format(coordinate, '{x} , {y}',6);
		}
	});

	map.addControl(mousePosition);

	const positionFeature = new ol.Feature();
	var coordinates = [-420000, 4550000];
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

	miPosicion = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [positionFeature],
		}),
	});

	map.addLayer(miPosicion);
}



