# Code

## Data structures

### `::App`

Properties :
 - `currentPosition` ::Waypoint
 - `waypointsList` [::Waypoint]
 - `currentTrack` ::Track
 - `tracksList` [::Track]
 - `options` :
		- `mapIsCenteredOnGpsPosition` ::Boolean
		- `waypointsLabelsAreDisplayed` ::Boolean
		- `currentLocationIsDisplayed` ::Boolean
		- `currentTrackIsDisplayed` ::Boolean
		- `gpsPostProcessingIsOn` ::Boolean

 
### `::Waypoint`

Properties :
 - `latitude` ::Number
 - `longitude` ::Number
 - `altitude` ::Number
 - `timestamp` ::UnixTS : when the waypoint was set.
 - `label` ::String : label of the waypoint : by default the date and time it was set, can be modified.
 - `marker` ::String : name of the Leaflet icon file to use to display the point. No need to specify color.
 - `isDisplayedOnTheMap` ::Boolean : if `true` the marker is displayed on the map.
 
Private properties :
 - `mapHandler` ::LeafletHandler.
 

 
### `currentTrack` (global variable)

Properties :
 - `points` [::Waypoint] list of the waypoints of the track.
 - `label` ::String : "Trace actuelle".
 - `color` ::ColorCssString : CSS color code string of the track's color on the map.
 - `isDisplayedOnTheMap` ::Boolean : if `true` the track is displayed on the map.
 
Private properties :
 - `mapHandler` ::LeafletHandler.
 
### `::Track`

Properties :

 
### `::BackgroundMap`

Properties :


# Fonctionnalités

## MAP 
	Fonctionnalités :
	- Se déplacer droite, gauche, haut, bas, 
	- Zoomer plus et moins,
	- Afficher le menu.
	- Raffraichissement uniquement quand focus.
	
	Mode auto :
	Affichage d'un "TRACE" clignotant à change nouveau point.

## INFOS

	"TRACE" (rouge) affiché 
	Si trace : information : CAP suivi et vitesse instantanée
	Si waypoint cible : Affichage du nom, cap à suivre, distance et ETA

	"marquer pt" 	"RAFRAICHIR"		"act. trace"
	"marquer Pt" 						"désact. trace"

	quand on active trace : 
		même trace ou nouvelle trace ?
		si nouvelle trace : sauver ou pas l'actuelle ?
		si oui : non ou entrer le nom
	quand marquer point : entrer nom et enregistrer en affichant

## POINTS : affichage nom, lattitude, longitude, altitude et date de création

	"" 	"Afficher"		"Options"
	"" 	"Cacher"		"Options"
	
	Options :
	- Sélectionner/déselectionner comme cible
	- Changer la couleur
	- Changer le nom
	- Supprimer
	- Centrer la carte à cet endroit (désactive centrer la carte sur la position courante)
	- Déplacer ?
	- Trier selon ?
	

## TRACES : affichage nom, date 1er point et date du dernier point 

	"" 	"Afficher"		"Options"
	"" 	"Cacher"		"Options"
	
	Options :
	- Changer la couleur
	- Changer le nom
	- Supprimer
	- Déplacer ?
	- Trier selon ?

## FONDS DE CARTE

## OPTIONS :
	- carte :
		- afficher ou ne pas afficher le nom des points
		- centrer/ne pas centrer sur le dernier point
	- GPS
		- algo de lissage des traces et d'élimination des points
		- haute précision si disponible ?
		
# A faire

- Toaster à améliorer
- Optimiser l'affichage de la track modifiée uniquement
- comment restarter une appli sur le téléphone
- Si nouveau point de track pas très loin (? c'est quoi ?) du précédent, on ne l'enregistre pas
- Tester le enableHighAccuracy
- Ajouter le timestamp aux enregistrements de track (voir toutes les infos du GPS ?)
- Faire un test simplified de mode privileged pour enregistrement
- affichage CSS menu tabs et options si plus d'une page
- ajouter la gestion des versions GIT

# Cleaning
Mettre paramètrage touches et code dans le même fichier
State
	softkeys:	{"","ENTER","Enregistrer"}
	actions:
	
# General
- debounce system
- MMS problem

# How do the GPS works :

Properties :
- `latitude`
- longitude
- altitude
- accuracy : 10 or 11
- altitudeAccuracy : 0
- heading : 0
- speed : 0

	
