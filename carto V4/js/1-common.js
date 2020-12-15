/*
Dimensions :
- fullscreen : 240x320
- avec infobar : 240 x 

- header : 		30px de haut
- menu : 		28px de haut
- softkeys : 	27 px de haut
- root : 	ce qui reste

*/

// -----------------------------------------------------------------
// input
// -----------------------------------------------------------------

let input = {
	generateHtml : function(title,initialValue,targetSelector) {
		let html = '<h1>' + title + '</h1><input type="text" id="input" value="' + (initialValue ? initialValue : '') + '"></input>';
		$(targetSelector).html(html);
		// To set focus on the input and select the input value
		let input = $('#input');
		var strLength = input.val().length;
		input.focus();
		input[0].setSelectionRange(0, strLength);
	}
}


// -----------------------------------------------------------------
// App visibility check
// -----------------------------------------------------------------
// App visibility check ----------------------------------------
	document.addEventListener("visibilitychange", function () {
		if (document.hidden) {
			appHasFocus = false;
		} 
		else {
			appHasFocus = true;
			app.onFocus();
		} 
	});
	
// -----------------------------------------------------------------
// Toastr
// -----------------------------------------------------------------
const toastr = {
	info : function (text) {
		$("#toastrMsg").html('<center><i class="fas fa-info-circle" style="color:#b30086;"></i><br/>' + text + '</center>');
		$("#toastr").attr("class","visible");
		setTimeout(function(){ $("#toastr").attr("class","hidden"); }, 1000);
	},
	warning : function (text) {
		$("#toastrMsg").html('<center><i class="fas fa-exclamation-circle" style="color:#b30086;"></i><br/>' + text + '</center>');
		$("#toastr").attr("class","visible");
		setTimeout(function(){ $("#toastr").attr("class","hidden"); }, 1000);
	},
	question : function(text) {
		// state.push("QUESTION");
		$("#toastr").attr("class","visible");
		$("#toastrMsg").html('<center><i class="fas fa-question-circle"  style="color:#b30086;"></i><br/>' + text + '</center>');
	},
	hide: function() {
		$("#toastr").attr("class","hidden");
	}
}
	
	
// -----------------------------------------------------------------
// Keyboard management
// -----------------------------------------------------------------
const minDeltaBetweenKeys = 200; // In ms
let lastKeyTs = new Date().getTime();

document.addEventListener("keydown", event => {
	console.log("\"" + event.key + "\" keyboard event received in state : \"" + state.current() + "\"");
	const keyTs = new Date().getTime();
	// Anti bounce filtering
	if ((keyTs - lastKeyTs) > minDeltaBetweenKeys) {
		lastKeyTs = keyTs;
		
		switch (event.key) {
			case "ArrowLeft" :
			case "ArrowRight" :
			case "ArrowUp" :
			case "ArrowDown" :
			
			case "SoftLeft" :
			case "PageDown" :
			case "Enter" :
			case "SoftRight" :
			case "PageUp" :
			
			case "Backspace" :
				if (	states[state.current()] 
						&& states[state.current()].keysActions
						&& states[state.current()].keysActions[event.key]) {
					states[state.current()].keysActions[event.key](event);
				}
				else console.log("No key action.");
				break;
			default:
				console.log("No key action.");
				break;
			
		}
		
	}
	else {
		console.log("Anti-bounce : invalid key");
	}
});

// -----------------------------------------------------------------
// Rotator
// -----------------------------------------------------------------

const Rotator = function(list,options) {
	this.options = options;
	this.list = list;
	this.currentIndex = (this.options && this.options.initialSelectionIndex) ? this.options.initialSelectionIndex() : 0;
}

Rotator.prototype.verticalScrollToActiveElement = function() {
	if ($("tr[id^=" + this.options.selectedItemIdPrefix + "].active") && $("tr[id^=" + this.options.selectedItemIdPrefix + "].active").position()) document.getElementById("root").scrollTo({top: $("tr[id^=" + this.options.selectedItemIdPrefix + "].active").position().top, behavior: 'smooth'});
}

Rotator.prototype.refreshSelection = function() {
	// Refresh selection
	if (this.options.selectedItemIdPrefix) {
		const that = this;
		this.list.forEach(function(item,index) {
			if (index === that.currentIndex) 	$("#" +  that.options.selectedItemIdPrefix + index).addClass("active");
			else								$("#" +  that.options.selectedItemIdPrefix + index).removeClass("active");
		});
	}
	// Refresh accordingly hide/show
	if (this.options.showDomElementPrefix) {
		const that = this;
		this.list.forEach(function(item,index) {
			if (index === that.currentIndex) 	$(that.options.showDomElementPrefix + index).show();
			else								$(that.options.showDomElementPrefix + index).hide();
		});
	}
	displaySoftKeysLabels();
	this.verticalScrollToActiveElement();
};

Rotator.prototype.currentItem = function() {
	return this.list[this.currentIndex];
};

Rotator.prototype.next = function() {
	if (this.currentIndex < this.list.length - 1) 	this.currentIndex += 1;
	else 											this.currentIndex = 0;
	this.refreshSelection();
};

Rotator.prototype.previous = function() {
	if (this.currentIndex != 0) this.currentIndex -= 1;
	else 						this.currentIndex = this.list.length - 1;
	this.refreshSelection();
};

Rotator.prototype.generateHtml = function() {
	this.refreshHTML();
	this.refreshSelection();
};

Rotator.prototype.refreshHTML = function() {
	let html = '<table>';
	const that = this;
	this.list.forEach(function(option,index) {
		html += `<tr id="{{id}}" class="list">
					<td class="list">{{icon}}{{itemsNumbered}}</td>
					<td class="list">
						<label>{{label}}</label>
						{{infos}}
					</td>
					<td class="text-center list">
						{{type}}
					</td>				
				 </tr>`;
		const id = that.options.selectedItemIdPrefix + index;
		const label = option.label;
		let itemsNumbered = "";
		if (that.options.itemsNumbered === "reverse") itemsNumbered = '<br/><span class="info">' + (that.list.length - index) + '</span>';
		let type = "";
		switch(option.rotatorType) {
			case "BOOLEAN":
				if (option.rotatorValue) {
					if (option.rotatorValue() === true) 	type = '<input type="checkbox" checked>';
					else						type = '<input type="checkbox">';
				}
				else 							type = '<input type="checkbox">';
				break;
			case "MENU":
				type = '<i class="fas fa-thumbs-up"></i>';
				break;
			default:
				type = '<i class="fas fa-chevron-right"></i>' 
				break;
				
		}

		if (option.rotatorInfos) {
			const infos = '<div class="info">' + option.rotatorInfos() + '</div>';
			html = html.replace('{{infos}}',infos);
		}
		else html = html.replace('{{infos}}',"");
		if (option.rotatorIcon) {
			const icon ='<label><i class="' + option.rotatorIcon + '"></i></label>';
			html = html.replace('{{icon}}',icon);
		}
		else html = html.replace('{{icon}}',"");
		html = html.replace('{{id}}',id);
		html = html.replace('{{label}}',label);
		html = html.replace('{{type}}',type);
		html = html.replace('{{itemsNumbered}}',itemsNumbered);
	});
	html += '</table>'
	$(this.options.targetDomSelector).html(html);
}

// -----------------------------------------------------------------
// MENU
// -----------------------------------------------------------------

const Menu = function(list,options) {
	this.horizontalScrollToActiveElement = function() {
		document.getElementById("menu").scrollTo({left: $(".menuSelected").position().left, behavior: 'smooth'});
	}

	this.list = list;
	this.options = options;
	this.currentIndex = (this.options && this.options.initialSelectionIndex) ? this.options.initialSelectionIndex() : 0;
	this.currentItem = function() {
		return this.list[this.currentIndex];
	};
	this.refreshSelection = function() {
		// Refresh selection
		if (this.options.selectedItemIdPrefix) {
			const that = this;
			this.list.forEach(function(item,index) {
				if (index === that.currentIndex) 	$("#" + that.options.selectedItemIdPrefix + index).addClass("menuSelected");
				else								$("#" + that.options.selectedItemIdPrefix + index).removeClass("menuSelected");
			});
		}
		// Refresh accordingly hide/show
		if (this.options.showDomElementPrefix) {
			const that = this;
			this.list.forEach(function(item,index) {
				if (index === that.currentIndex) 	$(that.options.showDomElementPrefix + index).show();
				else								$(that.options.showDomElementPrefix + index).hide();
			});
		}
		// Execute onSelected
		if (this.currentItem().onSelected) this.currentItem().onSelected();
		displaySoftKeysLabels();
		this.horizontalScrollToActiveElement();
	};
	this.next = function() {
		if (this.currentIndex < this.list.length - 1) 	this.currentIndex += 1;
		else 											this.currentIndex = 0;
		this.refreshSelection();
	};
	this.previous = function() {
		if (this.currentIndex != 0) this.currentIndex -= 1;
		else 						this.currentIndex = this.list.length - 1;
		this.refreshSelection();
	};
	this.generateHtml = function() {
		this.refreshHTML();
		this.refreshSelection();
	};
	this.refreshHTML = function() {
		const that = this;
		let html = '';
		this.list.forEach(function(menuItem,index) {
			html += '<span class="menuItem" id="menuItem' + index + '">' + menuItem.label + '</span>';
		});
		$("#menu").html(html);
	};
	this.hide = function() {
		$("#menu").hide();
	};
	this.show = function() {
		$("#menu").show();
	};
}

// -----------------------------------------------------------------
// States management
// -----------------------------------------------------------------

const state = {
	// Setter and Getter
	map:true,
	infos_startTracking_question : 	false,
	waypoints_options : 			false,
	waypoints_options_rename : 		false,
	waypoints_options_delete : 		false,
	tracks_actions : 				false,
	files_actions : 				false,
	// infosOptionsValue : "",
	options_value : "",
	current: function() {
		// Getter
		if (this.map === true) return "MAP";
		else {
			var currentState = "";
			switch (menu.currentItem().statePrefix) {
				case "INFOS_GPS":
					if (app.gpsWatchHandler === null) {
						if (infos_startTracking_question)	currentState = "INFOS_GPS_MANUEL_QUESTION";
						else 								currentState = "INFOS_GPS_MANUEL";
					}	
					else									currentState = "INFOS_GPS_AUTO";							
					break;
				case "WAYPOINTS":
					if (this.waypoints_options) {
						if (this.waypoints_options_rename) 			currentState = "WAYPOINTS_OPTIONS_RENAME";
							else if (this.waypoints_options_delete)	currentState = "WAYPOINTS_OPTIONS_DELETE";
								else 								currentState = "WAYPOINTS_OPTIONS";
					}						
					else {
						if (waypoints.list.length > 0) {
							if (waypoints.currentItem().rotatorValue()) currentState = "WAYPOINTS_DISPLAYED";
							else 										currentState = "WAYPOINTS_NOTDISPLAYED";
						}
						else											currentState = "WAYPOINTS_EMPTY";
					}
					break;
				case "TRACKS":
					if (this.tracks_actions) {
						if (this.tracks_actions === "infos") 						currentState = "TRACKS_ACTIONS_infos";
							else if (this.tracks_actions === "rename") 					currentState = "TRACKS_ACTIONS_rename";
								else if (this.tracks_actions === "delete")			currentState = "TRACKS_ACTIONS_delete";
									else if (this.tracks_actions === "changeColor")	currentState = "TRACKS_ACTIONS_changeColor";
										else 										currentState = "TRACKS_ACTIONS";
					}
					else {
						if (tracks.currentItem().rotatorValue()) 	currentState = "TRACKS_DISPLAYED";
						else 										currentState = "TRACKS_NOTDISPLAYED";
					}
					break;
				case "MAP_BACKGROUNDS":
					if (mapBackgrounds.currentItem().active) 	return "MAP_BACKGROUNDS_ACTIVE";
					else 										return "MAP_BACKGROUNDS_NOTACTIVE";
					break;
				case "OPTIONS":
					if (options.currentItem().rotatorType === "BOOLEAN" && options.currentItem().rotatorValue() === true) 		currentState = "OPTIONS_ACTIVE";
					if (options.currentItem().rotatorType === "BOOLEAN" && options.currentItem().rotatorValue() === false)		currentState = "OPTIONS_NOTACTIVE";
					if (options.currentItem().rotatorType === "SELECT")	{
						switch(this.options_value) {
							case "coordinatesFormat":
								currentState = "OPTIONS_COORDINATESFORMAT";
								break;
							case "units":
								currentState = "OPTIONS_UNITS";
								break;
							default :
								currentState = "OPTIONS_SELECT";
								break;
						}
					}
					if (options.currentItem().rotatorType === "INPUT")		currentState = "OPTIONS_INPUT";
					break;
				case "FILES":
					if (this.files_actions) {
						if (this.files_actions === "delete")	return "FILES_ACTIONS_delete";
						else									return "FILES_ACTIONS";
					}
					else 										return "FILES";
					return "";
					break;
				case "LAYERS":
					if (layers.currentItem().active) 			return "LAYERS_ACTIVE";
					else 										return "LAYERS_NOTACTIVE";
					break;
				case "FIND":
					return "FIND";
					break;
			}
			return currentState;
		}
	}
};

const displaySoftKeysLabels = function() {
	const currentState = state.current();
	if (states[currentState]) {
		if (states[currentState].softKeysLabels) {
			if (states[currentState].softKeysLabels[app.lang]) {
				if ("SoftLeft" in states[currentState].softKeysLabels[app.lang]) {
					$("#left").html(states[currentState].softKeysLabels[app.lang].SoftLeft);
				}
				else console.log('Module "displaySoftKeysLabels" : there is no "SoftLeft" property for state "' + currentState + '" and "softKeysLabels" and  "' + app.lang + '".');
				if ("Center" in states[currentState].softKeysLabels[app.lang]) {
					$("#center").html(states[currentState].softKeysLabels[app.lang].Center);
				}
				else console.log('Module "displaySoftKeysLabels" : there is no "Center" property for state "' + currentState + '" and "softKeysLabels" and  "' + app.lang + '".');
				if ("SoftRight" in  states[currentState].softKeysLabels[app.lang]) {
					$("#right").html(states[currentState].softKeysLabels[app.lang].SoftRight);
				}
				else console.log('Module "displaySoftKeysLabels" : there is no "SoftRight" property for state "' + currentState + '" and "softKeysLabels" and  "' + app.lang + '".');
			}
			else console.log('Module "displaySoftKeysLabels" : there is no "' + app.lang + '" property for state "' + currentState + '" and "softKeysLabels".');
		}
		else console.log('Module "displaySoftKeysLabels" : there is no "softKeysLabels" entry for state "' + currentState + '".');
	}
	else console.log('Module "displaySoftKeysLabels" : there is no state "' + currentState + '".');
}