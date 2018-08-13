if(typeof require != "undefined") {
   var d3 = require('./d3.min.js')
};

MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

var layers, model, trainer;

var model_str = "\
model = new browsernn.Model(); \n\
layers = []; \n\n\
layers.push({type: 'input', n: 1, d: 2, depth: 1}); \n\
layers.push({type: 'dense', n_neurons: 8, activation: 'tanh'}); \n\
layers.push({type: 'dense', n_neurons: 4, activation: 'tanh'}); \n\
layers.push({type: 'softmax', n_classes: 2}); \n\
\n\
params = {optimizer: 'sgd', \n\
		learning_rate: .001, \n\
		momentum: 0.01, \n\
		batch_size: 10, \n\
		l2_decay: 0.01}; \n\
trainer = new browsernn.Trainer(model, layers, params); \n\
";

var ss = 50.0; // scaling -- thank you andrej
var data, labels, N;
var layer_idx = 2; 
var neuron0 = 0;
var neuron1 = 1;


function neuronStr() {
	layer_str = model.layers[layer_idx].layer_type;
	layer_num = layer_n_map[layer_idx];
	layer_type = layer_str == "dense" || layer_str == "softmax" ? "$\\boldsymbol{z}$" : "$\\boldsymbol{h}$";
	if (layer_str == 'dense') {
		math_str = "$\\boldsymbol{z}^{(" + layer_num + ")}=\\boldsymbol{W}^{(" + layer_num + ")}\\boldsymbol{h}^{(" + (layer_num-1) + ")}+b^{(" + layer_num + ")}$";
	} else {
		math_str = "$\\boldsymbol{h}^{(" + layer_num + ")}=f(\\boldsymbol{W}^{(" + layer_num + ")} \\boldsymbol{h}^{(" + (layer_num-1) + ")}+b^{(" + layer_num + ")})$";
	}	
	neuron_str = layer_type + "$^{(" + layer_num + ")}_" + neuron0 + "$ and " + layer_type + "$^{(" + layer_num + ")}_" + neuron1 + "$ from " + math_str;
	return neuron_str;
}


function onchange() {
	selectValue = d3.select('.layer-menu').select('select').property('value');
	layer_idx = layer_data.indexOf(selectValue) + 1
	layer_str = model.layers[layer_idx].layer_type
	neuron_str = neuronStr();
	d3.select('#cycle-weights')
		.text(neuron_str);
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]); 
};




function refresh() {
	eval($(".network").val());
	layer_data = [];
	var dense_counter = 0;
	layer_n_map = {};

	for (var i=1; i<model.layers.length-1; i++) {
		layer_name = model.layers[i].layer_type;
		layer_num = i - dense_counter;
		if (layer_name == 'dense') dense_counter += 1;
		layer_prefix = i < model.layers.length-2 ? 'Layer ' + layer_num + ': ' : 'Output: '
		layer_str = layer_prefix + layer_name[0].toUpperCase() + layer_name.substr(1) + '(' + model.layers[i].out_d + ')';
		layer_data.push(layer_str);
		layer_n_map[i] = layer_num;
	}

	if (model.layers.length <= layer_idx) layer_idx = model.layers.length - 1;

	neuron_str = neuronStr();
	d3.select('#cycle-weights')
		.text(neuron_str);

	
	var select = d3.select('.layer-menu')
		  .html("")
		  .append('select')
		  .attr('id','layer-dropdown')
		  .on('change',onchange)
	

	var option = select
		.selectAll('option')
		.data(layer_data).enter()
		.append('option')
		.text(function(d) { return d; })
		.property("selected", function(d){ return d == layer_data[layer_idx-1]; })


	d3.select('.layer-menu')
		.append('input')
		.attr('id','cycle-button')
		.attr('type','submit')
		.attr('value',"Change weights")
		.on('click', function() { cycleWeights() })

	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function updateLayerIdx(idx) {
	// unselect the current layer
	layer_idx = idx;
	neuron0 = 0;
	neuron1 = 1;
	
	// reset the visual description
	layer_str = model.layers[layer_idx].layer_type;
	neuron_str = neuronStr();
	d3.select('#cycle-weights')
		.text(neuron_str);
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}	



function drawPoint(ctxx, x, y, r) {
	ctxx.beginPath();
	ctxx.arc(x, y, r, 0, Math.PI*2, true);
	ctxx.closePath();
	ctxx.stroke();
	ctxx.fill();
	
}


function draw(rep) {
	
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	
	var stride = 3;
    var gridstep = 5;
    var gridx = [];
    var gridy = [];
    
	var netx = new browsernn.Tensor(1, 2, 1);
	var tmp = 0
	for (var x=0.0, cx=0; x<=WIDTH; x+=stride, cx++){
		for (var y=0.0, cy=0; y<=HEIGHT; y+=stride, cy++) {

			// scaling the input for the canvas
			netx.w[0] = (x-WIDTH/2)/ss;
			netx.w[1] = (y-HEIGHT/2)/ss;
			
			var a = model.forward(netx, false);

			if(a.w[0] < a.w[1]) {
				ctx.fillStyle = '#99E8F6';
			} else {
				ctx.fillStyle = 'rgb(250,150,150)';
			}

			ctx.fillRect(x-stride/2-1, y-stride/2-1, stride+2, stride+2);
			
			tmp+=1;
			if(cx%gridstep == 0 && cy%gridstep == 0) {
				// pull the learned weights from the layer selected (layer_idx)
				var xt = model.layers[layer_idx].out_units.w[neuron0];
				var yt = model.layers[layer_idx].out_units.w[neuron1];
				gridx.push(xt);
				gridy.push(yt);
			}
		}
		
	}
	


	min_max_x = minMax(gridx);
	min_max_y = minMax(gridy);

	// this took me a very long time to understand..ty andrej
	// visualization of the learned representations of weights at the selected layer 

	
	if (rep == true) {
		rep_ctx.clearRect(0,0,rep_WIDTH,rep_HEIGHT);
		//rep_ctx.strokeStyle = "#0000FF"
		
		rep_ctx.lineWidth = 0.6;
		var grid_n = gridx.length;
		var n = Math.floor(Math.sqrt(grid_n));
		rep_ctx.beginPath();
		counter = 0;
		for (var x=0; x<n; x++) {
			for (var y=0; y<n; y++) {

				var idx_1 = (x + 1) * n + y;
				var idx_2 = (x * n + y);

				if (x < (n-1)) {
					x_raw_1 = rep_WIDTH * (gridx[idx_1] - min_max_x.min_value) / min_max_x.diff_value
					y_raw_1 = rep_HEIGHT*(gridy[idx_1] - min_max_y.min_value) / min_max_y.diff_value;
					
					x_raw_2 = rep_WIDTH*(gridx[idx_2] - min_max_x.min_value) / min_max_x.diff_value;
					y_raw_2 = rep_HEIGHT*(gridy[idx_2] - min_max_y.min_value) / min_max_y.diff_value;

					rep_ctx.moveTo(x_raw_1, y_raw_1);
					rep_ctx.lineTo(x_raw_2, y_raw_2);
					counter+=1;
				}

				var idx_1 = x * n + y;
				var idx_2 = x * n + y + 1;
				// if index 1 is at least 0 AND index 2 is at least 0 and index 1 is less than 1681 (number of points in grid) and index 2 less than number of points in grid 
				// AND y is less than 40
				if (y < (n-1)) {
					// normalize the data and rescale the representation to fit the canvas
					x_raw_1 = rep_WIDTH*(gridx[idx_1] - min_max_x.min_value) / min_max_x.diff_value;
					y_raw_1 = rep_HEIGHT*(gridy[idx_1] - min_max_y.min_value) / min_max_y.diff_value;
					
					x_raw_2 = rep_WIDTH*(gridx[idx_2] - min_max_x.min_value) / min_max_x.diff_value;
					y_raw_2 = rep_HEIGHT*(gridy[idx_2] - min_max_y.min_value) / min_max_y.diff_value;


					rep_ctx.moveTo(x_raw_1,y_raw_1);
					rep_ctx.lineTo(x_raw_2,y_raw_2);
				}
				
			}
		}

		rep_ctx.stroke();
	}

	//draw data points
	ctx.lineWidth = 1;
	for (var i=0; i<N; i++) {
		if (labels[i] == 1) {
			ctx.fillStyle = '#04B7D6';
		} else {
			ctx.fillStyle = 'rgb(200,100,100)';
		}

		drawPoint(ctx, data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, 3.0);

		netx.w[0] = data[i][0];
		netx.w[1] = data[i][1];
		var a = model.forward(netx, false);
		if (rep == true) {
			var xt = rep_WIDTH * (model.layers[layer_idx].out_units.w[neuron0] - min_max_x.min_value) / min_max_x.diff_value;
			var yt = rep_HEIGHT * (model.layers[layer_idx].out_units.w[neuron1] - min_max_y.min_value) / min_max_y.diff_value
			if (labels[i]==0) rep_ctx.fillStyle = 'rgb(180,100,100)';// '#04B7D6';
			else rep_ctx.fillStyle =  '#04B7D6';
			drawPoint(rep_ctx, xt, yt, 5.0);
		}
		
	}

}


function update() {
	// propogate the network forward
	var start_dt = new Date().getTime();
	var x = new browsernn.Tensor(1, 2, 1);
	var avg_loss = 0.0;
	for (var iters=0; iters<20; iters++) {
		for (var ix=0; ix<N; ix++) {
			x.w = data[ix];
			y = labels[ix];
			var stats = trainer.fit(x,y);
			avg_loss += stats.loss;
		}
	}
	
	avg_loss /= N * iters;

	var end_dt = new Date().getTime();
	var forward_dt = end_dt - start_dt;
}


cycleWeights = function() {
	
	if (neuron1 >= (model.layers[layer_idx].out_d - 1)) {
		neuron1 = 0;
	} else {
		neuron1 += 1
	}
	if (neuron0 >= (model.layers[layer_idx].out_d - 1)) {
		neuron0 = 0;
	} else {
		neuron0 += 1;
	}

	layer_str = model.layers[layer_idx].layer_type
	neuron_str = neuronStr();
	d3.select('#cycle-weights')
		.text(neuron_str);
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}


