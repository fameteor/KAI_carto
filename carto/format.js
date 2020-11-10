// =================================================================
// Formatting functions
// =================================================================

// -----------------------------------------------------------------
// Number < 10 on 2 digits : ex "01"
// -----------------------------------------------------------------
const format_xxDigits = function(number) {
	if (number === 0) return "00";
	else 	if (number < 10) return "0" + number;
			else return number;
}

// -----------------------------------------------------------------
// Date like : 29/04/2020 12:23:45
// -----------------------------------------------------------------
const format_dateString = function(date) {
	return format_xxDigits(date.getDate()) 
	+ "/" 
	+ format_xxDigits(date.getMonth() + 1) 
	+ "/" 
	+ date.getFullYear()
	+ " " 
	+ format_xxDigits(date.getHours()) 
	+ ":" 
	+ format_xxDigits(date.getMinutes()) 
	+ ":" 
	+ format_xxDigits(date.getSeconds());
}