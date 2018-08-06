// generate a random real/integer/natural with some given parameters

function random(seed) {
	if (typeof seed != "undefined") {
	    var x = Math.sin(seed++) * 10000;
	    return x - Math.floor(x);
	} else {
		return Math.random();
	}
}

var randr = function(a,b) { return Math.random()*(b-a)+a; }
var randi = function(a,b) { return Math.floor(Math.random()*(b-a)+a); }

var return_value = false;
var v_value = 0.0;


function zeros(n) {
	if(isNaN(n) || typeof(n) == 'undefined') {
		return [];
	} else {
		return new Float64Array(n);
	}
}


function mouseClick(x,y, shiftPressed) {
	var xt = (x-WIDTH/2)/ss;
	var yt = (y-HEIGHT/2)/ss;
	
	
	data.push([xt, yt]);
	if(shiftPressed) {
		labels.push(1);
	} else {
		labels.push(0);
	}
	N += 1;

}

function minMax(w) {
	if (w.length == 0) {
		return {}
	}

	var min_value = w[0];	
	var max_value = w[0];
	var min_idx = 0;
	var max_idx = 0;

	for (var i=1; i<w.length; i++) {
		if (w[i] < min_value) {
			min_value = w[i];
			min_idx = i;
		}
		if (w[i] > max_value) {
			max_value = w[i];
			max_idx = i;
		}
	}
	return {
		min_idx: min_idx,
		min_value: min_value,
		max_idx: max_idx,
		max_value: max_value,
		diff_value: (max_value - min_value)
	}
}