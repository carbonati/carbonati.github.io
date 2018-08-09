if (typeof require != "undefined") {
	alert('in')
	var d3 = require('./js/d3.min.js')
	alert('d3 loaded')
}

var header = d3.select('body')
	.append('tan-header')
	.classed('tan-header', true)
	.append('div')
	.classed('content l-page', true)

var logo = header.append('a')
	.classed('logo', true)
	.attr('href',"https://carbonati.github.io")
	.text("Tanner's blog")

var nav = header.append('div')
	.classed('nav', true)
	.append('a')
	.attr('href', 'https://carbonati.github.io/contact')
	.text('Contact')

var nav = header.append('div')
	.classed('nav', true)
	.append('a')
	.attr('href', 'https://carbonati.github.io/about')
	.text('About')

var nav = header.append('div')
	.classed('nav', true)
	.append('a')
	.attr('href', 'https://carbonati.github.io/')
	.text('Home')