
var Reactbone = require('../lib/'),
	Backbone = require('backbone'),
	assert = require('assert');

describe('Reactbone', function() {
	it('should have all Backbone object properties', function() {
		var backboneProps = Object.getOwnPropertyNames(Backbone);
		Object.getOwnPropertyNames(Reactbone).forEach(function(prop) {
			assert.ok(~backboneProps.indexOf(prop), "prop: "+prop);
		});
	});
	it('should expose ReactModel', function() {
		assert.ok(Reactbone.hasOwnProperty("ReactModel"));
		assert.ok(typeof Reactbone.ReactModel === 'function');
	});
	it('should expose ReactCollection', function() {
		assert.ok(Reactbone.hasOwnProperty("ReactCollection"));
		assert.ok(typeof Reactbone.ReactCollection === 'function');
	});
});
