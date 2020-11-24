// =================================================================
// 							 STATES.JS
// =================================================================
const states = {
	
	// init --------------------------------------------------------
	init : {
		
	},
	
	// warmstart ---------------------------------------------------
	warmStart : {
		
	},
	// MENU --------------------------------------------------------
	MAP : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'<i class="fas fa-search-minus"></i>',
					Center : 	'MENU',
					SoftRight :	'<i class="fas fa-search-plus"></i>'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				app.myMap.panBy([-100,0]);
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				app.myMap.panBy([100,0]);
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				app.myMap.panBy([0,-100]);
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				app.myMap.panBy([0,100]);
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				if (app.zoomLevel > 0) {
					app.zoomLevel = app.zoomLevel - 1;
					app.myMap.setZoom(app.zoomLevel);
				}
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				state.map = false;
				$("#map").hide();
				$("#menu").show();
				$("#root").show();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				if (app.zoomLevel < 19) {
					app.zoomLevel = app.zoomLevel + 1;
					app.myMap.setZoom(app.zoomLevel);
				}
				event.stopPropagation();
			},
			Backspace: function(event) {
				
			}
		},
	},
	// MENU --------------------------------------------------------
	INFOS_GPS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Tracer',
					Center : 	'Rafraîchir',
					SoftRight :	'Options'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				console.log("tracer");
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				gps.setAndDisplayCurrentPosition();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.infosOptions = true;
				infosOptions.generateHtml();
				$("#infos").hide();
				$("#infosOptions").show();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	INFOS_GPS_OPTIONS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Modifier',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				infosOptions.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				infosOptions.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				switch (infosOptions.currentIndex) {
					case 0:
						state.infosOptionsValue = "coordinatesFormat";
						infosOptionsCoordinatesFormat.generateHtml();
						break;
					case 1:
						state.infosOptionsValue = "units";
						infosOptionsUnits.generateHtml();
						break;
				}
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.infosOptions = false;
				displaySoftKeysLabels();
				$("#infosOptions").hide();
				$("#infos").show();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.infosOptions = false;
				displaySoftKeysLabels();
				$("#infosOptions").hide();
				$("#infos").show();
				event.stopPropagation();
			}
		},
	},
	INFOS_GPS_OPTIONS_COORDINATESFORMAT : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Sélectionner',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				infosOptionsCoordinatesFormat.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				infosOptionsCoordinatesFormat.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				infosOptions.currentItem().rotatorValue(infosOptionsCoordinatesFormat.currentItem().label);
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				gps.refreshCurrentPosition();
				waypoints.generateHtml();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				event.stopPropagation();
			}
		},
	},
	INFOS_GPS_OPTIONS_UNITS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Sélectionner',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				infosOptionsUnits.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				infosOptionsUnits.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				infosOptions.currentItem().rotatorValue(infosOptionsUnits.currentItem().label);
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				gps.refreshCurrentPosition();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.infosOptionsValue = "";
				infosOptions.generateHtml();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_DISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Ajouter ici',
					Center : 	'Cacher',
					SoftRight :	'Actions'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				gps.setAndDisplayWaypoint();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				waypoints.currentItem().rotatorValue(!waypoints.currentItem().rotatorValue());
				waypoints.generateHtml();
				waypoints.refreshMap();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.waypointsOptions = true;
				displaySoftKeysLabels();
				waypoints_options.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_NOTDISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Ajouter ici',
					Center : 	'Afficher',
					SoftRight :	'Actions'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				gps.setAndDisplayWaypoint();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				waypoints.currentItem().rotatorValue(!waypoints.currentItem().rotatorValue());
				waypoints.generateHtml();
				waypoints.refreshMap();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.waypointsOptions = true;
				displaySoftKeysLabels();
				waypoints_options.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_OPTIONS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Choisir',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints_options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints_options.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				switch(waypoints_options.currentItem().state) {
					case "goto":
						waypoints.target(waypoints.currentItem());
						state.waypointsOptions = false;
						waypoints.generateHtml();
						displaySoftKeysLabels();
						gps.refreshCurrentPosition();
						break;
					case "rename":
						break;
				}
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.waypointsOptions = false;
				waypoints.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.waypointsOptions = false;
				waypoints.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	TRACKS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'inactif',
					Center : 	'inactif',
					SoftRight :	'inactif'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				menu.hide();
				$("#root").height(235 + 28);
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				menu.show();
				$("#root").height(235);
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	MAP_BACKGROUNDS_ACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	''
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	MAP_BACKGROUNDS_NOTACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'sélectionner',
					SoftRight :	''
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				mapBackgrounds.activeItem(mapBackgrounds.currentItem());
				mapBackgrounds.generateHtml();
				mapBackgrounds.refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	OPTIONS_ACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'decocher',
					SoftRight :	''
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(!options.currentItem().rotatorValue());
				options.generateHtml();
				app.currentPosition.refreshMap();
				waypoints.refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	OPTIONS_NOTACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'cocher',
					SoftRight :	''
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(!options.currentItem().rotatorValue());
				options.generateHtml();
				app.currentPosition.refreshMap();
				waypoints.refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	OPTIONS_SELECT : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'modifier',
					SoftRight :	''
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				menu.hide();
				$("#root").height(235 + 28);
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				menu.show();
				$("#root").height(235);
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	OPTIONS_INPUT : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'inactif',
					Center : 	'modifier',
					SoftRight :	'inactif'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				menu.hide();
				$("#root").height(235 + 28);
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				menu.show();
				$("#root").height(235);
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	
}	

// Firefox PC compatibility : -------------------------------------- 
// - PageDown replaces SoftLeft
// - PageUp replaces SoftRight
Object.keys(states).forEach(function(state) {
	if (states[state].keysActions) {
		if (states[state].keysActions.SoftLeft) states[state].keysActions.PageDown = states[state].keysActions.SoftLeft;
		if (states[state].keysActions.SoftRight) states[state].keysActions.PageUp = states[state].keysActions.SoftRight;
	}
});
// -----------------------------------------------------------------