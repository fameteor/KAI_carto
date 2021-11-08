let mapBackgroundsList = [
	{
		label:"web : photos IGN",
		url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",
		active:false,
		maxZoom: 	20,
		minZoom:	2,
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
		maxZoom: 	19,
		minZoom:	2,
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
		maxZoom: 	19,
		minZoom:	2,
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
		label:"web : OpenCycleMap",
		url:"https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=" + keys["openCycleMap" ],
		active:false,
		maxZoom: 	20,
		minZoom:	2,
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
		label:"web : Landscape",
		url:"https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=" + keys["openCycleMap" ],
		active:false,
		maxZoom: 	20,
		minZoom:	2,
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
		label:"web : Outdoors",
		url:"https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=" + keys["openCycleMap" ],
		active:false,
		maxZoom: 	20,
		minZoom:	2,
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
		label:"local : SHOM",
		url:"localTiles/tilesShom/{z}/{x}/{y}.jpg",
		active:false,
		maxZoom: 	13,
		minZoom:	8,
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
		label:"local : Munster",
		url:"localTiles/munster/{z}/{x}/{y}.jpg",
		active:false,
		maxZoom: 	15,
		minZoom:	11,
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
		label:"local : opencyclemapMurDrau",
		url:"localTiles/opencyclemapMurDrau/{z}/{x}/{y}.png",
		active:false,
		maxZoom: 	17,
		minZoom:	5,
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
			maxZoom: 	mapBackgrounds.activeItem().maxZoom,
			minZoom:	mapBackgrounds.activeItem().minZoom,
			id: 		''
		}
	).addTo(app.myMap);
	if (app.zoomLevel > mapBackgrounds.activeItem().maxZoom) app.zoomLevel = mapBackgrounds.activeItem().maxZoom;
	else if (app.zoomLevel < mapBackgrounds.activeItem().minZoom) app.zoomLevel = mapBackgrounds.activeItem().minZoom;
}