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
					Center : 	'Options',
					SoftRight :	'Rafraîchir'
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
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				gps.setAndDisplayCurrentPosition();
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
				app.currentTrack = new Track({type:"RECORD"});
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
				// We start the tracking
				gps.watchStart();
				displaySoftKeysLabels();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				// We hide the question
				infos_startTracking_question = false;
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
					Center : 	'Actions',
					SoftRight :	''
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
			Enter: function(event) {
				event.preventDefault();
				
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
					Center : 	'Actions',
					SoftRight :	'Cacher'
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
				state.waypoints_options = true;
				displaySoftKeysLabels();
				waypoints_options.generateHtml();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				waypoints.currentItem().rotatorValue(!waypoints.currentItem().rotatorValue());
				waypoints.generateHtml();
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
	WAYPOINTS_NOTDISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Ajouter ici',
					Center : 	'Actions',
					SoftRight :	'Afficher'
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
				state.waypoints_options = true;
				displaySoftKeysLabels();
				waypoints_options.generateHtml();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				waypoints.currentItem().rotatorValue(!waypoints.currentItem().rotatorValue());
				waypoints.generateHtml();
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
	WAYPOINTS_OPTIONS : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Choisir',
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
					case "setAsStartingPoint":
						// We set the starting point
						waypoints.itineraryStart(waypoints.currentItem());
						// We exit from waypoints actions
						state.waypoints_options = false;
						waypoints.generateHtml();
						displaySoftKeysLabels();
						toastr.info("Point fixé comme point de départ");
						break;
					case "itineraryToThisPoint":
						// We build and display itinerary
						search.displayItinerary(app.currentPosition.coords,waypoints.currentItem().coords,"Vers " + waypoints.currentItem().label);
						// We enable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = true;
						options.generateHtml();
						// We exit from waypoints actions
						state.waypoints_options = false;
						waypoints.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(app.currentPosition.coords,app.zoomLevel);
						displaySoftKeysLabels();
						break;
					case "itineraryFromStartingPointToThisPoint":
						if (waypoints.itineraryStart()) {
							// We build and display itinerary
							search.displayItinerary(waypoints.itineraryStart().coords,waypoints.currentItem().coords,"De " + waypoints.itineraryStart().label + " vers " + waypoints.currentItem().label);
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
							app.myMap.flyTo(waypoints.itineraryStart().coords,app.zoomLevel);
							displaySoftKeysLabels();
						}
						else toastr.warning("Merci de fixer d'abord le point de départ");
						break;
					case "changeIcon":
						// We use the icon tableRotator here
						state.waypoints_options_changeIcon = true;
						displaySoftKeysLabels();
						waypoints_iconsRotator.generateHtml();
						break;
				}
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
	WAYPOINTS_OPTIONS_rename: {
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
	WAYPOINTS_OPTIONS_delete: {
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
	WAYPOINTS_OPTIONS_changeIcon : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'Choisir'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				waypoints_iconsRotator.left();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				waypoints_iconsRotator.right();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints_iconsRotator.up();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints_iconsRotator.down();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				waypoints.currentItem().markerIcon = waypoints_iconsRotator.currentItem().value;
				state.waypoints_options_changeIcon = false;
				state.waypoints_options = false;
				displaySoftKeysLabels();
				waypoints.generateHtml();
				waypoints.currentItem().refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.waypoints_options_changeIcon = false;
				state.waypoints_options = false;
				displaySoftKeysLabels();
				waypoints.generateHtml();
				event.stopPropagation();
			}
		},
	},
	TRACKS_DISPLAYED : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'+ actuelle',
					Center : 	'Actions',
					SoftRight :	'Cacher'
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
					// We change its color and name
					app.currentTrack.color = "purple";
					app.currentTrack.label = format_dateString(new Date());
					// We add the current track and 
					tracks.addAndDisplay(app.currentTrack);
					// We delete the current track
					app.currentTrack = new Track({type:"RECORD"});
					app.currentTrack.refreshMap();
				}
				else toastr.warning("La trace actuelle est vide.");
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				tracks.currentItem().rotatorValue(!tracks.currentItem().rotatorValue());
				tracks.generateHtml();
				tracks.refreshMap();
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
					Center : 	'Actions',
					SoftRight :	'Afficher'
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
					// We change its color and name
					app.currentTrack.color = "#800080";
					app.currentTrack.label = format_dateString(new Date());
					// We add the current track and 
					tracks.addAndDisplay(app.currentTrack);
					// We delete the current track
					app.currentTrack = new Track({type:"RECORD"});
					app.currentTrack.refreshMap();
				}
				else toastr.warning("La trace actuelle est vide.");
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				tracks.currentItem().rotatorValue(!tracks.currentItem().rotatorValue());
				tracks.generateHtml();
				tracks.currentItem().refreshMap();
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
						tracks.currentItem().displayInfos1();
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
						// We use the color tableRotator here
						tracks_colorsRotator.generateHtml();
						break;
					case "changeIcon":
						// We use the color tableRotator here
						tracks_iconsRotator.generateHtml();
						break;
					case "positionMapAtStart":
						// We disable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = false;
						options.generateHtml();
						// We exit from tracks actions
						state.tracks_actions = false;
						tracks.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(tracks.currentItem().coords[0],app.zoomLevel);
						displaySoftKeysLabels();
						break;
					case "positionMapAtEnd":
						// We disable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = false;
						options.generateHtml();
						// We exit from tracks actions
						state.tracks_actions = false;
						tracks.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(tracks.currentItem().coords[tracks.currentItem().coords.length - 1],app.zoomLevel);
						displaySoftKeysLabels();
						break;
				}
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
					Center : 	'<i class="fas fa-chevron-down"></i>',
					SoftRight :	'Fermer'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				if (app.screenWidthScroll != 0) app.screenWidthScroll -= 200;
				document.getElementById("root").scrollTo({
					left: app.screenWidthScroll,
					behavior: 'smooth'
				});
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				if (app.screenWidthScroll != 800) app.screenWidthScroll += 200;
				document.getElementById("root").scrollTo({
					left: app.screenWidthScroll,
					behavior: 'smooth'
				});
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				tracks.currentItem().displayInfos1();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.currentItem().getDbAltitudes();
				event.stopPropagation();
			},
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
	TRACKS_ACTIONS_changeColor : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'Choisir'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				tracks_colorsRotator.left();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				tracks_colorsRotator.right();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				tracks_colorsRotator.up();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks_colorsRotator.down();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				tracks.currentItem().color = tracks_colorsRotator.currentItem().value;
				state.tracks_actions = false;
				displaySoftKeysLabels();
				tracks.generateHtml();
				tracks.refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
				event.stopPropagation();
			}
		},
	},
	TRACKS_ACTIONS_changeIcon : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'Choisir'
			},
		},
		keysActions : {
			ArrowLeft: function(event) {
				event.preventDefault();
				tracks_iconsRotator.left();
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				tracks_iconsRotator.right();
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				tracks_iconsRotator.up();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks_iconsRotator.down();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				tracks.currentItem().rotatorIcon = tracks_iconsRotator.currentItem().value;
				state.tracks_actions = false;
				displaySoftKeysLabels();
				tracks.generateHtml();
				tracks.refreshMap();
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				state.tracks_actions = true;
				displaySoftKeysLabels();
				tracks_actions.generateHtml();
				event.stopPropagation();
			}
		},
	},
	MAP_BACKGROUNDS_ACTIVE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'Choisir'
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
					Center : 	'',
					SoftRight :	'Choisir'
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
			SoftRight: function(event) {
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
					Center : 	'',
					SoftRight :	'Enlever'
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
			SoftRight: function(event) {
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
					Center : 	'',
					SoftRight :	'Ajouter'
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
			SoftRight: function(event) {
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
					Center : 	'',
					SoftRight :	'Décocher'
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
			SoftRight: function(event) {
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
					Center : 	'',
					SoftRight :	'Cocher'
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
			SoftRight: function(event) {
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
				switch (options.currentItem().value) {
					case "coordinatesFormat":
						state.options_value = "coordinatesFormat";
						optionsCoordinatesFormat.generateHtml();
						break;
					case "units":
						state.options_value = "units";
						optionsUnits.generateHtml();
						break;
					case "itineraryProfile":
						state.options_value = "itineraryProfile";
						optionsProfile.generateHtml();
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
					Center : 	'',
					SoftRight :	'Choisir'
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
			SoftRight: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(optionsCoordinatesFormat.currentItem().label);
				state.options_value = "";
				options.generateHtml();
				gps.refreshCurrentPosition();
				// No need to waypoints.generateHtml(); 
				// Waypoint format will be updated when waypoint menu displayed
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
					Center : 	'',
					SoftRight :	'Choisir'
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
			SoftRight: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(optionsUnits.currentItem().label);
				state.options_value = "";
				options.generateHtml();
				gps.refreshCurrentPosition();
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
	OPTIONS_PROFILE : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'',
					SoftRight :	'Choisir'
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
				optionsProfile.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				optionsProfile.next();
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				options.currentItem().rotatorValue(optionsProfile.currentItem().label);
				state.options_value = "";
				options.generateHtml();
				gps.refreshCurrentPosition();
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
	FILES : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Actions',
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
				files.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				files.next();
				event.stopPropagation();
			},
			Enter: function(event) {
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
	SEARCH_form : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Saisir',
					Center : 	'Chercher',
					SoftRight :	'Options'
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
			SoftLeft: function(event) {
				event.preventDefault();
				search.focusOnInput();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				let input = $("#searchInput").val().trim();
				if (input != "") {
					search.value = input;
					search.generateAndDisplayResultRotator(input);
				}
				else toastr.warning("Merci d'indiquer un nom à chercher");
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				// We memorise the input value
				search.value = $("#searchInput").val().trim();
				// We display the search.formOptionsRotator
				search.formOptionsRotator.generateHtml();
				state.search_state = "formOptions";
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
	SEARCH_result : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'Saisir',
					Center : 	'Actions',
					SoftRight :	''
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
				search.resultRotator.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				search.resultRotator.next();
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				// We display the form state
				search.displayInput();
				search.focusOnInput();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				// We display the search.resultActionsRotator
				search.resultActionsRotator.generateHtml();
				state.search_state = "resultActions";
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
	SEARCH_formOptions : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Choisir',
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
				search.formOptionsRotator.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				search.formOptionsRotator.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				switch(search.formOptionsRotator.currentItem().value) {
					/*
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
						*/
				}
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				search.displayInput();
				event.stopPropagation();
			}
		}
	},
	SEARCH_resultActions : {
		softKeysLabels : {
			fr : {
					SoftLeft :	'',
					Center : 	'Choisir',
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
				search.resultActionsRotator.previous();
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				search.resultActionsRotator.next();
				event.stopPropagation();
			},
			Enter: function(event) {
				event.preventDefault();
				switch(search.resultActionsRotator.currentItem().value) {
					case "positionMap":
						// We return to the result state
						state.search_state = "result";
						search.resultRotator.generateHtml();
						// We disable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = false;
						options.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(search.resultRotator.currentItem().coords);
						displaySoftKeysLabels();
						break;
					case "saveAsWaypoint":
						// Add new waypoint ---------------------------------
						let waypoint = new Waypoint({
							coords : 	search.resultRotator.currentItem().coords,
							altitude : 	0,
							timestamp : new Date().getTime(),
							label : 	search.resultRotator.currentItem().label
						});
						
						waypoints.list.unshift(waypoint);
						// We select the new waypoint
						waypoints.currentIndex = 0;
						waypoints.generateHtml();
						waypoints.refreshMap();
						toastr.info("Point enregistré");
						// We return to the result state
						state.search_state = "result";
						search.resultRotator.generateHtml();
						break;
					case "saveAndSetAsStartingPoint":
						// Add new waypoint ---------------------------------
						let waypoint2 = new Waypoint({
							coords : 	search.resultRotator.currentItem().coords,
							altitude : 	0,
							timestamp : new Date().getTime(),
							label : 	search.resultRotator.currentItem().label
						});
						
						waypoints.list.unshift(waypoint2);
						waypoints.itineraryStart(waypoint2);
						// We select the new waypoint
						waypoints.currentIndex = 0;
						waypoints.generateHtml();
						waypoints.refreshMap();
						toastr.info("Point enregistré et fixé comme point de départ");
						// We return to the result state
						state.search_state = "result";
						search.resultRotator.generateHtml();
						break;
					case "itineraryToThisPoint":
						// We build and display itinerary
						search.displayItinerary(app.currentPosition.coords,search.resultRotator.currentItem().coords,"Vers " + search.resultRotator.currentItem().label);
						// We enable the map centering on current position
						app.options.mapIsCenteredOnGpsPosition = true;
						options.generateHtml();
						// We return to the result state
						state.search_state = "result";
						search.resultRotator.generateHtml();
						// We display the map
						state.map = true;
						$("#map").show();
						$("#menu").hide();
						$("#root").hide();
						app.myMap.flyTo(app.currentPosition.coords,app.zoomLevel);
						displaySoftKeysLabels();
						break;
					case "itineraryFromStartingPointToThisPoint":
						if (waypoints.itineraryStart()) {
							// We build and display itinerary
							search.displayItinerary(waypoints.itineraryStart().coords,search.resultRotator.currentItem().coords," De " + waypoints.itineraryStart().label + " vers " + search.resultRotator.currentItem().label);
							// We disable the map centering on current position
							app.options.mapIsCenteredOnGpsPosition = false;
							options.generateHtml();
							// We return to the result state
							state.search_state = "result";
							search.resultRotator.generateHtml();
							// We display the map
							state.map = true;
							$("#map").show();
							$("#menu").hide();
							$("#root").hide();
							app.myMap.flyTo(waypoints.itineraryStart().coords,app.zoomLevel);
							displaySoftKeysLabels();
						}
						else toastr.warning("Merci de fixer d'abord le point de départ");
						break;
				}
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				search.resultRotator.generateHtml()
				state.search_state = "result";
				displaySoftKeysLabels();
				event.stopPropagation();
			}
		}
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