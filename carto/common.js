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


const Iterable = function(list,htmlGenerationFct,selectIdPrefix,showIdPrefix) {
	this.list = list;
	this.selectIdPrefix = selectIdPrefix;
	this.currentIndex = 0;
	this.refreshSelection = function() {
		const that = this;
		this.list.forEach(function(item,index) {
			console.log(that.selectIdPrefix + index);
			console.log("current " + that.currentIndex)
			if (index === that.currentIndex) 	$(that.selectIdPrefix + index).addClass("selected");
			else								$(that.selectIdPrefix + index).removeClass("selected");
		});
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
	this.generateHtml = htmlGenerationFct;
}