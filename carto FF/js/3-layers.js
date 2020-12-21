let layersList = [
	{
		label:"web : OpenSeaMap",
		url:"https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
		active:false,
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-globe",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				this.active = value;
			}
			else {
				// Getter
				return this.active;
			}
		},
	},
	{
		label:"web : wmflabs hill shading",
		url:"http://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png",
		active:false,
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-globe",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				this.active = value;
			}
			else {
				// Getter
				return this.active;
			}
		},
	}
];

const layersOptions = {
	"selectedItemIdPrefix" : 	"layer",
	"targetDomSelector" : 		"#menuTarget_6",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		layersList.forEach((layer,index) => {
			if (layer.active) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}

const layers = new Rotator(layersList,layersOptions);


layers.activeItem = function(item) {
	if (item != undefined) {
		// Setter :
		this.list.forEach(function(layer){
			if (layer === item) layer.active = true;
			else 						layer.active = false;
		});
	}
	else {
		// Getter
		const value = this.list.find(layer => {
			return layer.active;
		});
		return value;
	}
}

layers.refreshMap = function() {
	if (app.myMapLayer) app.myMap.removeLayer(app.myMapLayer);
	if (layers.activeItem()) {
		app.myMapLayer = L.tileLayer(
			layers.activeItem().url, 
			{
				attribution:  '',
				maxZoom: 	19,
				minZoom:	2,
				id: 		'openStreetMap'
			}
		).addTo(app.myMap);
	}
}