var data;
var labels;
var N;

var randr = function(a,b,seed) { return random(seed)*(b-a)+a; }

// generates random value set by seed
function random(seed) {
	if (typeof seed != "undefined") {
	    var x = Math.sin(seed++) * 10000;
	    return x - Math.floor(x);
	} else {
		return Math.random();
	}
}

function simpleData(){
  	
  data = [];
  labels = [];

  data.push([0.2 ,   .9  ]); labels.push(0);
  data.push([3.1 ,   1.5  ]); labels.push(1);
  data.push([-1.0 ,   -0.7  ]); labels.push(0);
  data.push([0.5 ,   3.2  ]); labels.push(1);
  data.push([-2.8 ,   3.2  ]); labels.push(0);
  data.push([-1.0 ,   -2.2  ]); labels.push(1);
  data.push([-2.2 ,   1.3  ]); labels.push(0);
  data.push([2.1 ,   -0.4  ]); labels.push(1);
  data.push([-1.7 ,   2.7  ]); labels.push(0);
  data.push([0.4 ,   -0.4  ]); labels.push(1);
  data.push([-0.8 ,   2.7  ]); labels.push(1);
  N = labels.length;

  N = labels.length;
}


function spiralData() {
	
	data = [];
	labels = [];
	var n = 200;
	for (var i=0; i<n; i++) {
		var r = i/n*5 + browsernn.randr(-0.1, 0.1);
		var t = 1.25*i/n*2*Math.PI + browsernn.randr(-0.1,0.1);
		data.push([r*Math.sin(t), r*Math.cos(t)]); // polar coordinates
		labels.push(1);
	}	

	for (var i=0; i<n; i++) {
		var r = i/n*5 + browsernn.randr(-0.1, 0.1);
		var t = 1.25*i/n*2*Math.PI + Math.PI + browsernn.randr(-0.1,0.2);
		data.push([r*Math.sin(t), r*Math.cos(t)]); // polar coordinates
		labels.push(0);
	}	

	N = data.length;
	
	
}

function linearData() {
	// note: come back later and change the slope
	data = [];
	labels = [];
	n = 100;
	for (var i=0; i<n; i++) {
		randSeed = random(i);
		var x = randr(-4,4,randSeed)
		var y = randr(0.3,4,randSeed)
		data.push([x,y]);
		labels.push(0);
	}
	for (var i=0; i<n; i++) {
		randSeed = random(i);
		var x = randr(-4,4,randSeed);
		var y = randr(-4,-.3,randSeed);
		data.push([x,y]);
		labels.push(1);
	}
	N = data.length;
}


function circleData() {
	
	data = [];
	labels = [];
	n = 100;

	for (var i=0; i<100; i++) {
		var r = randr(0.0, 1.0);
		var t = randr(0.0, 2*Math.PI);
		data.push([r*Math.sin(t), r*Math.cos(t)]);
		labels.push(0);
	} 
		for (var i=0; i<100; i++) {
		var r = randr(1.5, 5.0);
	    //var t = randr(0.0, 2*Math.PI);    
	    var t = 2*Math.PI*i/50.0;
	    data.push([r*Math.sin(t), r*Math.cos(t)]);
	    labels.push(1);
	}
	N = data.length;
}


function sineData() {
	// sine wave + cos wave
	data = [];
	labels = [];	
	n = 200;
	
	var amp = Math.PI * 1/100;
	var k=0;
	for (i=-4; i<=4; i+=4/n) {
		x = i;
		y = Math.sin(k)*2 + browsernn.randr(-0.2, 0.2);
		k += amp
		data.push([x,y]);
		labels.push(0);
	}

	for (i=-4; i<=4; i+=4/n) {
		x = i;
		// y = i* randr(-.5,.5);
		y = -Math.cos(k)*2 + browsernn.randr(-0.2, 0.2);
		k += amp
		data.push([x,y]);
		labels.push(1);
	}
	
	N = data.length;
}



var dataSets = [
	{
		name: 'Spiral',
		generator: spiralData,
		src: './img/figure_spiral.png'
	},
	{
		name: 'Circle',
		generator: circleData,
		src: './img/figure_circle.png'
	},
	{
		name: 'Linear',
		generator: linearData,
		src: './img/figure_linear.png'
	},
	{
		name: 'Simple',
		generator: simpleData,
		src: './img/figure_simple.png'
	},
	{
		name: 'Sine Wave',
		generator: sineData,
		src: './img/figure_sine_wave.png'
	}
]


function dataTiles() {
	
	var dataOptions = d3.select('.data-options');
	
	dataSets.forEach(function(d,i) {
		dataOptions.append('div')
			// .classed('col-sm-2',true)
			.classed('data-menu',true)
			.append('img').attr('id', 'data-set')
			.attr('src', d.src)
			.attr('width', 60)
			.on("click", d.generator);
	});



    dataOptions.selectAll('#data-set')
    	.data(dataSets)
    	.enter()
    	.classed('data-set',true)
    	.on("click", function(d,i) {
    		dataOptions.selectAll('#data-set').classed("selected", false)
		      .filter(function(dd,ii) { return ii === i })
		      .classed("selected", true)
    	});

}

