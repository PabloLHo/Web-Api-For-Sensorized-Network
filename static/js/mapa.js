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
		projection: projection
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
}



