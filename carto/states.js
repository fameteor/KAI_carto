// =================================================================
// 							 STATES.JS
// =================================================================


// -----------------------------------------------------------------
// softKeysLabels
// -----------------------------------------------------------------
/*
Le appState est une arboresecence qui permet de gérer :
- l'affichage des softkeys (left, right, center)
- la gestion des softkeys, backspace et 

Etats impactant l'affichage et l'action des touches :
Pour event :
	ArrowLeft
	ArrowRight
	ArrowUp
	ArrowDown
	Center
	SoftRight
	SoftLeft
	Backspace

Pour affichage :
	Center
	SoftRight
	SoftLeft
*/
// Soft Keys labels --------------------------------------------
// Depending on states, in unknown states, nothing is displayed
const softKeysLabels = {
	"fr" : {
		"MAP" : {
			SoftLeft :	'<i class="fas fa-search-minus"></i>',
			Center : 	"MENU",
			SoftRight :	'<i class="fas fa-search-plus"></i>'
		},
		"MAP.INFOS_GPS_MANUAL" : {
			SoftLeft :	"Mode AUTO",
			Center : 	"RAFRAICHIR",
			SoftRight :	"Options"
		},
		"MAP.INFOS_GPS_AUTO" : {
			SoftLeft :	"Mode MANUEL",
			Center : 	"",
			SoftRight :	"Options"
		},
		"MAP.WAYPOINTS_DISPLAYED" : {
			SoftLeft :	"Ajouter",
			Center : 	"CACHER",
			SoftRight :	"Options"
		},
		"MAP.WAYPOINTS_NOTDISPLAYED" : {
			SoftLeft :	"Ajouter",
			Center : 	"AFFICHER",
			SoftRight :	"Options"
		},
		"MAP.WAYPOINTS.ADD" : {
			SoftLeft :	"Annuler",
			Center : 	"ENREGISTRER",
			SoftRight :	""
		},
		"MAP.TRACKS_DISPLAYED" : {
			SoftLeft :	"",
			Center : 	"CACHER",
			SoftRight :	"Enregistrer"
		},
		"MAP.TRACKS_NOTDISPLAYED" : {
			SoftLeft :	"",
			Center : 	"AFFICHER",
			SoftRight :	"Enregistrer"
		},
		"MAP.MAP_BACKGROUNDS_ACTIVE" : {
			SoftLeft :	"",
			Center : 	"",
			SoftRight :	""
		},
		"MAP.MAP_BACKGROUNDS_NOTACTIVE" : {
			SoftLeft :	"",
			Center : 	"UTILISER",
			SoftRight :	""
		},
		"MAP.OPTIONS_ACTIVE" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.OPTIONS_NOTACTIVE" : {
			SoftLeft :	"",
			Center : 	"ACTIVER",
			SoftRight :	""
		},
	}
}				




// -----------------------------------------------------------------
// keysActions
// -----------------------------------------------------------------
const keysActions = {
		/*
		"MAP" : {
			ArrowLeft: function(event) {
				alert("ArrowLeft");
			},
			ArrowRight: function(event) {
				alert("ArrowRight");
			},
			ArrowUp: function(event) {
				alert("ArrowUp");
			},
			ArrowDown: function(event) {
				alert("ArrowDown");
			},
			SoftLeft: function(event) {
				alert("SoftLeft");
			},
			Enter: function(event) {
				alert("Enter");
			},
			SoftRight: function(event) {
				alert("SoftRight");
			},
			Backspace: function(event) {
				alert("Backspace");
			}
		},
		*/
		"MAP" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				myMap.panBy([-100,0]);
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				myMap.panBy([100,0]);
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				myMap.panBy([0,-100]);
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				myMap.panBy([0,100]);
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				if (zoomLevel > 0) {
					zoomLevel = zoomLevel - 1;
					myMap.setZoom(zoomLevel);
				}
			},
			Enter: function(event) {
				event.preventDefault();
				$("#map").hide();
				$("#menu").show();
				state.current(menuStateCalculation());
			},
			SoftRight: function(event) {
				event.preventDefault();
				if (zoomLevel < 19) {
					zoomLevel = zoomLevel + 1;
					myMap.setZoom(zoomLevel);
				}
			}
		},
		"MAP.INFOS_GPS_MANUAL" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				gpsModeIsAuto = true;
				gpsWatchStart();
				state.current(menuStateCalculation());
			},
			Enter: function(event) {
				// Refresh GPS
				event.preventDefault();
				getGpsCurrentPosition();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.INFOS_GPS_AUTO" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				gpsModeIsAuto = false;
				gpsWatchStop();
				state.current(menuStateCalculation());
				refreshCurrentPosition();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS_DISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				markGpsCurrentPosition();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				waypoints.currentItem().displayed = !waypoints.currentItem().displayed;
				waypoints.generateHtml();
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS_NOTDISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				markGpsCurrentPosition();
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				waypoints.currentItem().displayed = !waypoints.currentItem().displayed;
				waypoints.generateHtml();
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS.ADD" : {
			SoftLeft :	"Annuler",
			Center : 	"ENREGISTRER",
			SoftRight :	""
		},
		"MAP.TRACKS_DISPLAYED" : {
			// D pad ---------------------------------
			ArrowUp: function(event) {
				event.preventDefault();
				tracks.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			// Softkeys ------------------------------
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				tracks.currentItem().displayed = !tracks.currentItem().displayed;
				tracks.generateHtml();
				refreshTracksDisplay();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				writeSelectedTrackToDisk();
				event.stopPropagation();
			},
			// Backspace -----------------------------
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.TRACKS_NOTDISPLAYED" : {
			// D pad ---------------------------------
			ArrowUp: function(event) {
				event.preventDefault();
				tracks.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			// Softkeys ------------------------------
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				tracks.currentItem().displayed = !tracks.currentItem().displayed;
				tracks.generateHtml();
				refreshTracksDisplay();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				writeSelectedTrackToDisk();
				event.stopPropagation();
			},
			// Backspace -----------------------------
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.MAP_BACKGROUNDS_ACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.MAP_BACKGROUNDS_NOTACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				mapBackgrounds.list.forEach(function(mapBackground,index) {
					if (index === mapBackgrounds.currentIndex) 	mapBackground.active = true;
					else										mapBackground.active = false;
				});
				mapBackgrounds.generateHtml();
				myMap.removeLayer(leafletBackgroundLayer);
				leafletBackgroundLayer = L.tileLayer(
					mapBackgrounds.currentItem().url, 
					{
						attribution:  '',
						maxZoom: 	19,
						minZoom:	2,
						id: 		'openStreetMap'
					}
				).addTo(myMap);
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.OPTIONS_ACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				// Toggle displayed state
				event.preventDefault();
				options.currentItem().target(!options.currentItem().target());
				options.generateHtml();
				state.current(menuStateCalculation());
				refreshCurrentPosition();
				displayDisplayedWaypointsMarker();
				event.preventDefault();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.OPTIONS_NOTACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				options.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				options.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				// Toggle displayed state
				event.preventDefault();
				options.currentItem().target(!options.currentItem().target());
				options.generateHtml();
				state.current(menuStateCalculation());
				refreshCurrentPosition();
				displayDisplayedWaypointsMarker();
				event.preventDefault();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		}
}		

// Firefox PC compatibility : -------------------------------------- 
// - PageDown replaces SoftLeft
// - PageUp replaces SoftRight
Object.keys(keysActions).forEach(function(state) {
	if (keysActions[state].SoftLeft) keysActions[state].PageDown = keysActions[state].SoftLeft;
	if (keysActions[state].SoftRight) keysActions[state].PageUp = keysActions[state].SoftRight;
});
// -----------------------------------------------------------------