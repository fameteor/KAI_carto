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
	INFOS_GPS_MANUEL : {
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
			SoftLeft: function(event) {
				event.preventDefault();
				if (app.currentTrack.coords.length != 0) {
					toastr.question("Voulez-vous effacer la trace actuelle ou la continuer ?");
					infos_startTracking_question = true;
				}
				else gps.watchStart();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				gps.setAndDisplayCurrentPosition();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
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
	INFOS_GPS_MANUEL_QUESTION : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Effacer',
					Center : 	'Annuler',
					SoftRight :	'Continuer'
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
			SoftLeft: function(event) {
				event.preventDefault();
				// We delete the current track
				app.currentTrack = new Track({});
				app.currentTrack.refreshMap();
				// We hide the question
				infos_startTracking_question = false;
				toastr.hide();
				// We start trhe tracking
				gps.watchStart();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				// We hide the question
				infos_startTracking_question = false;
				toastr.hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				// We hide the question
				infos_startTracking_question = false;
				toastr.hide();
				// We start trhe tracking
				gps.watchStart();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				// We hide the question
				infos_startTracking_question = true;
				toastr.hide();
				// We display the map
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	INFOS_GPS_AUTO : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Stop trace',
					Center : 	'',
					SoftRight :	'Actions'
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
			SoftLeft: function(event) {
				event.preventDefault();
				gps.watchStop();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				
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
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.options = false;
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.options = false;
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_EMPTY : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Ajouter ici',
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
			SoftLeft: function(event) {
				event.preventDefault();
				gps.setAndDisplayWaypoint();
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
				state.waypoints_options = true;
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
				state.waypoints_options = true;
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
						state.waypoints_options = false;
						waypoints.generateHtml();
						displaySoftKeysLabels();
						gps.refreshCurrentPosition();
						break;
					case "rename":
						state.waypoints_options_rename = true;
						input.generateHtml("Renommer le point",waypoints.currentItem().label,"#menuTarget_1");
						displaySoftKeysLabels();
						break;
					case "delete":
						toastr.question("Voulez-vous supprimer définitivement le point " + waypoints.currentItem().label + " ?");
						state.waypoints_options_delete = true;
						displaySoftKeysLabels();
						break;
					case "writeToSD":
						waypoints.currentItem().writeToSD();	
						break;
					case "positionMap" :
						// We disable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = false;
						options.generateHtml();
						// We exit from waypoints actions
						state.waypoints_options = false;
						waypoints.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(waypoints.currentItem().coords,app.zoomLevel);
						displaySoftKeysLabels();
						break;
				}
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.waypoints_options = false;
				waypoints.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.waypoints_options = false;
				waypoints.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_OPTIONS_RENAME: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Enregistrer',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			Enter: function(event) {
				event.preventDefault();
				// We rename the waypoint
				if ($("#input").val().trim() != "") {
					waypoints.currentItem().label = $("#input").val().trim();
					state.waypoints_options_rename = false;
					state.waypoints_options = false;
					gps.refreshCurrentPosition();
					waypoints.generateHtml();
					displaySoftKeysLabels();
				}
				else toastr.warning("Attention ce champ ne peut-être vide.")
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.waypoints_options_rename = false;
				waypoints_options.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.waypoints_options_rename = false;
				waypoints_options.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	WAYPOINTS_OPTIONS_DELETE: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Supprimer',
					Center : 	'',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			SoftLeft: function(event) {
				event.preventDefault();
				toastr.hide();
				state.waypoints_options_delete = false;
				state.waypoints_options = false;
				toastr.info(waypoints.currentItem().label + " a été supprimé.");
				// Delete this waypoint from the map if drawn
				if (waypoints.currentItem().markerIsDisplayedOnTheMap === true) {
					waypoints.currentItem().markerIsDisplayedOnTheMap = false;
					waypoints.currentItem().refreshMap();
				};
				// Delete this waypoint
				const indexToDeleted = waypoints.currentIndex;
				waypoints.list.splice(indexToDeleted, 1);
				// Activate the previous one
				let newSelectedIndex = (indexToDeleted != 0) ? (indexToDeleted - 1) : 0;
				waypoints.currentIndex = newSelectedIndex;
				// Update list and map and infos
				gps.refreshCurrentPosition();
				waypoints.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				toastr.hide();
				state.waypoints_options_delete = false;
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				toastr.hide();
				state.waypoints_options_delete = false;
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	TRACKS_DISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'+ actuelle',
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
				tracks.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				//if track is not empty
				if (app.currentTrack.coords.length != 0) {
					// We add the current track and change its color
					tracks.list.unshift(app.currentTrack);
					tracks.list[0].color = "purple";
					tracks.list[0].label = format_dateString(new Date());
					tracks.currentIndex = 0;
					tracks.generateHtml();
					tracks.refreshMap();
					// We delete the current track
					app.currentTrack = new Track({});
					app.currentTrack.refreshMap();
				}
				else toastr.warning("La trace actuelle est vide.");
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				tracks.currentItem().rotatorValue(!tracks.currentItem().rotatorValue());
				tracks.generateHtml();
				tracks.refreshMap();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
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
	TRACKS_NOTDISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'+ actuelle',
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
				tracks.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				//if track is not empty
				if (app.currentTrack.coords.length != 0) {
					// We add the current track and change its color
					tracks.list.unshift(app.currentTrack);
					tracks.list[0].color = "purple";
					tracks.list[0].label = format_dateString(new Date());
					tracks.currentIndex = 0;
					tracks.generateHtml();
					tracks.refreshMap();
					// We delete the current track
					app.currentTrack = new Track({});
					app.currentTrack.refreshMap();
				}
				else toastr.warning("La trace actuelle est vide.");
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				tracks.currentItem().rotatorValue(!tracks.currentItem().rotatorValue());
				tracks.generateHtml();
				tracks.currentItem().refreshMap();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
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
	TRACKS_ACTIONS : {
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
				tracks_actions.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks_actions.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				state.tracks_actions = tracks_actions.currentItem().value;
				displaySoftKeysLabels();
				switch(tracks_actions.currentItem().value) {
					case "infos":
						tracks.currentItem().getDbAltitudes();
						break;
					case "rename":
						console.log("ok")
						input.generateHtml("Renommer la trace",tracks.currentItem().label,"#menuTarget_2");
						break;
					case "delete":
						toastr.question("Voulez-vous supprimer définitivement la trace " + tracks.currentItem().label + " ?");
						displaySoftKeysLabels();
						break;
					case "writeToSD":
						tracks.currentItem().writeToSD();						
						break;
					case "changeColor":
						
						break;
				}
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.tracks_actions = false;
				tracks.generateHtml();
				tracks.refreshMap();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.tracks_actions = false;
				tracks.generateHtml();
				tracks.refreshMap();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	TRACKS_ACTIONS_infos: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'fermer'
			},
		},
		keysActions : {
			SoftRight: function(event) {
				event.preventDefault();
				state.tracks_actions = false;
				tracks.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.tracks_actions = false;
				tracks.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	TRACKS_ACTIONS_rename: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Enregistrer',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			Enter: function(event) {
				event.preventDefault();
				// We rename the waypoint
				if ($("#input").val().trim() != "") {
					tracks.currentItem().label = $("#input").val().trim();
					state.tracks_actions = false;
					tracks.generateHtml();
					displaySoftKeysLabels();
				}
				else toastr.warning("Attention ce champ ne peut-être vide.")
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				tracks_actions.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				tracks_actions.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	TRACKS_ACTIONS_delete: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Supprimer',
					Center : 	'',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			SoftLeft: function(event) {
				event.preventDefault();
				toastr.hide();
				state.tracks_actions = false;
				toastr.info(tracks.currentItem().label + " a été supprimé.");
				// Delete this track from the map if drawn
				if (tracks.currentItem().trackIsDisplayedOnTheMap === true) {
					tracks.currentItem().trackIsDisplayedOnTheMap = false;
					tracks.currentItem().refreshMap();
				};
				// Delete this track from the list
				const indexToDeleted = tracks.currentIndex;
				tracks.list.splice(indexToDeleted, 1);
				// Activate the previous track (or the initial)
				let newSelectedIndex = (indexToDeleted != 0) ? (indexToDeleted - 1) : 0;
				tracks.currentIndex = newSelectedIndex;
				// Display updated tracks list
				tracks.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				toastr.hide();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				toastr.hide();
				state.tracks_actions = true;
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
	LAYERS_ACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Désélectionner',
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
				layers.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				layers.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				layers.currentItem().active = false;
				layers.generateHtml();
				layers.refreshMap();
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
	LAYERS_NOTACTIVE : {
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
				layers.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				layers.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				layers.activeItem(layers.currentItem());
				layers.generateHtml();
				layers.refreshMap();
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
				gps.refreshCurrentPosition();
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
				gps.refreshCurrentPosition();
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
					Center : 	'Modifier',
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
				switch (options.currentIndex) {
					case 5:
						state.options_value = "coordinatesFormat";
						optionsCoordinatesFormat.generateHtml();
						break;
					case 6:
						state.options_value = "units";
						optionsUnits.generateHtml();
						break;
				}
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
	OPTIONS_COORDINATESFORMAT : {
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
				optionsCoordinatesFormat.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				optionsCoordinatesFormat.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(optionsCoordinatesFormat.currentItem().label);
				state.options_value = "";
				options.generateHtml();
				gps.refreshCurrentPosition();
				// No need to waypoints.generateHtml(); 
				// Waypoint format will be updated when waypoint menu displayed
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.options_value = "";
				options.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.options_value = "";
				options.generateHtml();
				event.stopPropagation();
			}
		},
	},
	OPTIONS_UNITS : {
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
				optionsUnits.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				optionsUnits.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(optionsUnits.currentItem().label);
				state.options_value = "";
				options.generateHtml();
				gps.refreshCurrentPosition();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.options_value = "";
				options.generateHtml();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.options_value = "";
				options.generateHtml();
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
	FILES : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
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
				files.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				files.next();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.files_actions = true;
				files_actions.generateHtml();
				displaySoftKeysLabels();
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
	FILES_ACTIONS : {
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
				files_actions.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				files_actions.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				switch(files_actions.currentItem().value) {
					case "loadFromSD":
						files.currentItem().readFromSD();
						break;
					case "rename":
						toastr.info("A implémenter");
						break;
					case "delete":
						state.files_actions = files_actions.currentItem().value;
						toastr.question("Voulez-vous supprimer définitivement le fichier " + files.currentItem().label + " ?");
						displaySoftKeysLabels();
						break;
				}
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				state.files_actions = false;
				files.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.files_actions = false;
				files.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	FILES_ACTIONS_delete: {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Supprimer',
					Center : 	'',
					SoftRight :	'Annuler'
			},
		},
		keysActions : {
			SoftLeft: function(event) {
				event.preventDefault();
				toastr.hide();
				files.removeCurrentFileFromSdAndDisplay();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				toastr.hide();
				state.files_actions = false;
				files.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				toastr.hide();
				state.files_actions = false;
				files.generateHtml();
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		},
	},
	FIND : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Nouv. rech.',
					Center : 	'Chercher',
					SoftRight :	'Voir carte'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				// Check for focus on the input
				if (!(document.activeElement === document.getElementById('searchInput'))) {
					event.preventDefault();
					menu.previous();
					event.stopPropagation();
				}
				else console.log("Search input has focus");
			},
			ArrowRight: function(event) {
				if (!(document.activeElement === document.getElementById('searchInput'))) {
					event.preventDefault();
					menu.next();
					event.stopPropagation();
				}
				else console.log("Search input has focus");
			},
			ArrowUp: function(event) {
				event.preventDefault();
				searchAutocomplete.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				searchAutocomplete.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				$('#searchInput').attr("type","text");
				// To set focus on the input and select the input value
				let input = $('#searchInput');
				var strLength = input.val().length;
				input.focus();
				input[0].setSelectionRange(0, strLength);
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				if ($("#searchInput").val().trim() != "") {
					search.autocomplete($("#searchInput").val().trim());
					// We hide the input
					$('#searchInput').attr("type","hidden");
					$('#searchInput').blur();
				}
				else toastr.warning("Merci d'indiquer un nom à chercher");
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				// We disable the map centering on current position
				app.options.mapIsCenteredOnGpsPosition = false;
				options.generateHtml();
				// We display the map
				state.map = true;
				$("#map").show();
				$("#menu").hide();
				$("#root").hide();
				app.myMap.flyTo(searchAutocomplete.currentItem().coords);
				displaySoftKeysLabels();
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
	}
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