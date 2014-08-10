
var _ = require('underscore'),
	Backbone = require('backbone');

Backbone.ReactModel = Backbone.Model.extend({
	property: function(name, component) {
		var _this = this,
			components = {};
		this.properties = this.properties || {};
		if(typeof name === 'object') components = name;
		else if(component === void 0) return this.properties[name];
		else components[name] = component;
		_.each(components, function(component, name) {
			_this[name] = _this.properties[name] = component;
			
			// parent <- child
			var handler = _.bind(vent, _this);
			_this.listenTo(component, 'change add destroy remove', handler);
			_this.toReactProps(name);

			// parent -> child
			var listener = _.bind(pass, _this);
			_this.on('change:'+name, listener);
			listener();

			function vent(model, collectionOrValue, options) {
				this.trigger("change:_"+name, this, this.toReactProps(name), options);
				this.trigger("change", this, options);
			}

			function pass(model, value) {
				if(value === void 0) value = this.get(name);
				if(typeof value === 'object') {
					component.set(value, {remove: false});
					this.toReactProps(name);
				}
				this.unset(name);
			}
		});
		return this;
	},
	helper: function(name, fn) {
		var _this = this,
			fns = {};
		this.helpers = this.helpers || {};
		if(typeof name === 'object') fns = name;
		else if(fn === void 0) return this.helpers[name];
		else fns[name] = fn;
		_.each(fns, function(fn, name) {
			if(typeof fn === 'string') fn = _this[name];
			_this.helpers[name] = _.bind(fn, _this);
		});
		return this;
	},
	toReactProps: function(name) {
		var _this = this;
		this._reactors = this._reactors || {};
		if(typeof name === 'string') {
			component = this.properties[name];
			data = this._reactors[name] = _.result(component, 'toReact') || component.toJSON();
			return data;
		}
		_.each(this.properties, function(component, name) {
			_this._reactors[name] = _.result(component, 'toReact') || component.toJSON();
		});
		return this._reactors;
	},
	toReact: function() {
		return _.extend(this.toJSON(), this._reactors, this.helpers);
	}
});

Backbone.ReactCollection = Backbone.Collection.extend({
	toReact: function() {
		return this.map(function(model) {
			return _.result(model, 'toReact') || model.toJSON();
		});
	}
});

module.exports = Backbone;
