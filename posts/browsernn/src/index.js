

var canvas;
var rep_canvas;
var ctx;
var rep_ctx;
var WIDTH, rep_WIDTH;
var HEIGHT, rep_HEIGHT;
var fps;

// note; fix this
function eventClick(e) {
	var x;
	var y;
	// horizontal and vertical coordinates
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		// set num of pixels in on element
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	mouseClick(x, y, e.shiftKey);

}

function eventKeyUp(e) {
  var keycode = ('which' in e) ? e.which : e.keyCode;
  keyUp(keycode);
}

function eventKeyDown(e) {
  var keycode = ('which' in e) ? e.which : e.keyCode;
  keyDown(keycode);
}


function nn_interval() {
	
	update();
	draw(false);
}


function nn_interval_rep() {
	update();
	draw(true);
}



function init(fps, rep) {

	canvas = d3.select('.classify-canvas');
	ctx = canvas.node().getContext('2d');
	
	
	if (rep == true) {
		rep_canvas = d3.select('.rep-canvas');
		rep_ctx = rep_canvas.node().getContext('2d');
		rep_WIDTH = rep_canvas.node().getBoundingClientRect().width;
		rep_HEIGHT = rep_canvas.node().getBoundingClientRect().height;
	}
	

	WIDTH = canvas.node().getBoundingClientRect().width;
	HEIGHT = canvas.node().getBoundingClientRect().height;

	$(".network").val(model_str);
	refresh();

	spiralData();


	canvas.on('click', eventClick);
	
	document.addEventListener('keyup', eventKeyUp, true);
  	document.addEventListener('keydown', eventKeyDown, true);
 	
 	

  	if (rep == true) setInterval(nn_interval_rep, 1000/fps);
  	else setInterval(nn_interval, 1000/fps)

}


window.onload = function() {
	
	init(10,true);
	dataTiles();

}