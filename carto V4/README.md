# Coding documentation

There is one Javascript file per application tab, containing one object whose name is equal to the javascript file name.

## `search` tab
The `search` object in the `js/search.js` file manages the "search" tab.

The "SEARCH" status can be :

* `SEARCH_form`
* `SEARCH_result`
* `SEARCH_formOptions`
* `SEARCH_resultActions`

The available properties / methods are :

* `search.resultRotator`
* `resultActionsRotator`
* `formOptionsRotator`
* `generateHtml()`
* `focusOnInput()`
* `generateResultRotator()`

# A faire

## Code
	
* Améliorer TOASTR pour multiples infos et pour mettre les questions en modal.
* Gérer dans les TRACKS les arrays : `segmentDistance`, `segmentSpeed`, `segmentBearing`.
* Afficher un onglet info pour les TRACKS permettant d'afficher : date de début et de fin, nombre de points, distance totale, temps de parcours, vitesse moyenne, vitesse de pointe.
* Calcul de l'ETA.
* Echelle à afficher selon l'unité.
* Bug : quand on change de fond de carte, il se trouve dessus l'éventuel layer affiché.
* Recherche de lieux : le curseur et la sélection ne s'affichent pas.
* Recherche de lieux : optimiser le choix de la source pour avoir des données optimales
* Bug : le positionnement automatique du menu sélectionné n'est pas toujours correct.

## Fonctionnalités

* Tracer un itinéraire vers un waypoint en utilisant une API de routage (cf Openstreetmap).
* Analyser une trace sur l'écran en la déroulant et en affichant : date et heure, vitesse, cap éventuellement et photos proches au cas ou.
* Permettre une sauvegarde complète des données sur la carte SD et permettre de les recharger. Possibilité de nommer ce fichier sauvegarde.
* Grouper les waypoints/tracks par directories ?
* Gérer le current waypoint et la current track comme les autres (les mettre en index 0 : non supprimables et dont le nom est non éditable).
* Obtenir le profil d'une track (via API Open route service) et l'enregistrer dans la track (voir sur SD si trace enregistrée).
* Recherche de lieux : offrir un menu : Afficher sur la carte, Enregistrer en waypoint...
* Permettre le routage vers un waypoint pour voiture, vélo ou autre option (via API Open route service).
	
## Utilitaire sur PC

* Uploader les fonds de carte Openstreetmap autour d'une trace donnée.
	