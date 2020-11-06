// -----------------------------------------------------
// ITERABLE :
// Public :
// - list
// - currentIndex() setter or getter
// - currentValue()
// - next()
// - previous()
// - generateHtml()

// Private :
// - selectIdPrefix
// - refreshSelection()
// -----------------------------------------------------
/* OPTIONS : all options are optionnal.
- selectedDomElementPrefix : selector prefix of the DOM element for selection/unselection
- showDomElementPrefix : selector prefix of the DOM element for hide/show
- initialSelectionIndex (::function) that return the index of the item that should be selected initially

*/


const Iterable = function(list,htmlGenerationFct,options) {
	this.list = list;
	this.options = options;
	this.currentIndex = (this.options && this.options.initialSelectionIndex) ? this.options.initialSelectionIndex() : 0
	this.refreshSelection = function() {
		// Refresh selection
		if (this.options.selectedDomElementPrefix) {
			const that = this;
			this.list.forEach(function(item,index) {
				if (index === that.currentIndex) 	$(that.options.selectedDomElementPrefix + index).addClass("selected");
				else								$(that.options.selectedDomElementPrefix + index).removeClass("selected");
			});
		}
		// Refresh accordingly hide/show
	};
	this.currentItem = function() {
		return this.list[this.currentIndex];
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
	this.refreshHTML = htmlGenerationFct
}