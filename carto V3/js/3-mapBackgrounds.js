let mapBackgroundsList = [
	{
		label:"web : photos IGN",
		url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",
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
		label:"web : carte IGN",
		url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",
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
		label:"web : OpenStreetMap",
		url:"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
		active:true,
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
		label:"local : IGN le Perrier Zoom 10",
		url:"carteIgn/{z}/{x}/{y}.jpg",
		active:false
		,
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

const mapBackgroundsOptions = {
	"selectedItemIdPrefix" : 	"mapBackground",
	"targetDomSelector" : 			"#menuTarget_3",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		mapBackgroundsList.forEach((mapBackground,index) => {
			if (mapBackground.active) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}

const mapBackgrounds = new Rotator(mapBackgroundsList,mapBackgroundsOptions);


mapBackgrounds.activeItem = function(item) {
	if (item != undefined) {
		// Setter :
		this.list.forEach(function(mapBackground){
			if (mapBackground === item) mapBackground.active = true;
			else 						mapBackground.active = false;
		});
	}
	else {
		// Getter
		const value = this.list.find(mapBackground => {
			return mapBackground.active;
		});
		return value;
	}
}

mapBackgrounds.refreshMap = function() {
	if (app.myMapBackgroundLayer) app.myMap.removeLayer(app.myMapBackgroundLayer);
	app.myMapBackgroundLayer = L.tileLayer(
		mapBackgrounds.activeItem().url, 
		{
			attribution:  '',
			maxZoom: 	19,
			minZoom:	2,
			id: 		'openStreetMap'
		}
	).addTo(app.myMap);
}