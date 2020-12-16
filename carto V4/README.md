# Coding documentation

There is one Javascript file per application tab, containing one object whose name is equal to the javascript file name.

## `search` tab
The `search` object in the `js/search.js` file manages the "search" tab.

The "SEARCH" states can be :

* `SEARCH_form`
* `SEARCH_result`
* `SEARCH_formOptions`
* `SEARCH_resultActions`

The available methods are :
* `search.displayInput()` : displays the search input field and go to the `SEARCH_form` state and keys display.
* `search.focusOnInput()` : set the focus on the input field with input value selection.
* `search.generateAndDisplayResultRotator()` : generates and display the `search.resultRotator` and go to the `SEARCH_result`  state and keys display.

The available rotators are :

* `search.resultRotator` : displays the search results.
* `search.resultActionsRotator` : displays the available actions on results.
* `search.formOptionsRotator` : displays the differents search options.

# A faire

## Code
	
* Améliorer TOASTR pour multiples infos et pour mettre les questions en modal.
* Gérer dans les TRACKS les arrays : `segmentDistance`, `segmentSpeed`, `segmentBearing`.
* Afficher un onglet info pour les TRACKS permettant d'afficher : date de début et de fin, nombre de points, distance totale, temps de parcours, vitesse moyenne, vitesse de pointe.
* Calcul de l'ETA.
* Echelle à afficher selon l'unité.
* Bug : quand on change de fond de carte, il se trouve dessus l'éventuel layer affiché.
* Recherche de lieux : optimiser le choix de la source pour avoir des données optimales
* Recherche de lieux : gérer les pbs réseaux et codes erreurs serveur.
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
	