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
 - `coords` ::[lattitude,longitude]
 - `longitude` ::Number
 - `altitude` ::Number
 - `timestamp` ::UnixTS : when the waypoint was set.
 - `label` ::String : label of the waypoint : by default the date and time it was set, can be modified.
 - `marker` ::String : name of the Leaflet icon file to use to display the point. No need to specify color.
 - `isDisplayedOnTheMap` ::Boolean : if `true` the marker is displayed on the map.
 
Private properties :
 - `mapHandler` ::LeafletHandler.
 
Method :
 - `refresh` : refresh the waypoint in the application : map, data... depending on the options
 
### `::Track`

Properties :
 - `points` [::Waypoint] list of the waypoints of the track.
 - `label` (opt) ::String : by default the date and time it was set, can be modified.
 - `color` (opt) ::ColorCssString : CSS color code string of the track's color on the map.
 - `isDisplayedOnTheMap` (opt:true) ::Boolean : if `true` the track is displayed on the map.
 
Private properties :
 - `mapHandler` ::LeafletHandler.
 
Method :
 - `refresh` : refresh the track in the application : map, data... depending on the options

 
### `::BackgroundMap`

Properties :


	
