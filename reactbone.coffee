###
  @name Reactbone
  @author Chris Andrejewski <chrisishereladies@gmail.com>
  @license GPL v2
  @source http://github.com/andrejewski/reactbone
###

if typeof window == 'undefined' || typeof require == 'function'
	_ = require 'underscore'
	Backbone = require 'backbone'
	Reactbone = {}
	exports = Reactbone
	module.exports = exports if typeof module != 'undefined'
else
	Reactbone = this

Reactbone.ReactModel = Backbone.Model.extend
	property: (name, component) ->
		@properties = @properties || {}
		if typeof name == 'object'
			components = name
		else if !component
			return @properties[name]
		else
			components = {}
			components[name] = component
		_.each components, (component, name) =>
			@[name] = @properties[name] = component
			# model <- component
			vent = (model, collectionOrValue, options) ->
				@trigger "change:_#{name}", @, (@toReactProps name), options
				@trigger "change", @, options
			handler = _.bind vent, @
			@listenTo component, 'change add destroy remove', handler
			@toReactProps name
			# model -> component
			pass = (m, value = @get name) ->
				if typeof value == 'object'
					component.set value, {remove: false}
					@toReactProps name
				@unset name
			listener = _.bind pass, @
			@on "change:#{name}", listener
			do listener
		@
	helper: (name, func) ->
		@helpers = @helpers || {}
		if typeof name == 'object'
			funcs = name
		else if !func
			return @helpers[name]
		else
			funcs = {}
			funcs[name] = func
		_.each funcs, (func, name) =>
			func = @[name] if typeof func == 'string'
			@helpers[name] = dunc = _.bind func, @
		@
	toReactProps: (name) ->
		@_reactors = @_reactors || {}
		if name
			component = @properties[name]
			data = @_reactors[name] = _.result(component, 'toReact') || component.toJSON()
			return data
		_.each @properties, (component, name) =>
			@_reactors[name] = _.result(component, 'toReact') || component.toJSON()
		@_reactors
	toReact: -> _.extend @toJSON(), @_reactors, @helpers

Reactbone.ReactCollection = Backbone.Collection.extend
	toReact: -> @map (model) => _.result(model,'toReact') || model.toJSON()

	