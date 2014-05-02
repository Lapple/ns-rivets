(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['noscript', 'rivets'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('noscript'), require('rivets'));
    } else {
        ns.ViewRivets = factory(root.ns, root.rivets);
    }
}(this, function (ns, rivets) {

    var ATTRIBUTE_ADAPTER = ':';
    var ITERATION_ADAPTER = '*';

    var CHANGED_EVENT = 'ns-model-changed';
    var INSERT_EVENT = 'ns-model-insert';
    var REMOVE_EVENT = 'ns-model-remove';

    /**
     * Checks if the provided object is an `ns.Model` instance.
     * @param  {Object}  object
     * @return {Boolean}
     */
    var isModel = function(object) {
        return object instanceof ns.Model;
    };

    /**
     * Checks if the provided object is an `ns.ModelCollection` instance.
     * @param  {Object}  object
     * @return {Boolean}
     */
    var isCollection = function(object) {
        return object instanceof ns.ModelCollection;
    };

    /**
     * Returns jpath that is assigned to the given `:` keypath, e.g.
     *
     *     models.message:loading   -> .loading
     *     models.todo:state.hidden -> .state.hidden
     *
     * @param  {String} keypath
     * @return {String}
     */
    var getJpathFromKeypath = function(keypath) {
        if (keypath.indexOf(ATTRIBUTE_ADAPTER) !== -1) {
            return '.' + keypath.split(ATTRIBUTE_ADAPTER).pop();
        }

        return null;
    };

    rivets.configure({
        handler: function(target, event, binding) {
            this.call(binding.model, event, binding);
        }
    });

    /**
     * Subscribes to model attribute update.
     */
    rivets.adapters[ATTRIBUTE_ADAPTER] = {
        subscribe: function(obj, keypath, callback) {
            if (isModel(obj)) {
                obj.on(CHANGED_EVENT + '.' + keypath, callback);
            }
        },
        unsubscribe: function(obj, keypath, callback) {
            if (isModel(obj)) {
                obj.off(CHANGED_EVENT + '.' + keypath, callback);
            }
        },
        read: function(obj, keypath) {
            if (isModel(obj)) {
                return obj.get('.' + keypath);
            }
        },
        publish: function(obj, keypath, value) {
            if (isModel(obj)) {
                obj.set('.' + keypath, value);
            }
        }
    };

    /**
     * Subscribes to collection contents update.
     */
    rivets.adapters[ITERATION_ADAPTER] = {
        subscribe: function(obj, keypath, callback) {
            if (isCollection(obj)) {
                obj.on(INSERT_EVENT, callback);
                obj.on(REMOVE_EVENT, callback);
            }
        },
        unsubscribe: function(obj, keypath, callback) {
            if (isCollection(obj)) {
                obj.off(INSERT_EVENT, callback);
                obj.off(REMOVE_EVENT, callback);
            }
        },
        read: function(obj, keypath) {
            if (isCollection(obj)) {
                return obj.models;
            }
        }
    };

    var View = ns.View;
    var ViewPrototype = View.prototype;

    var ViewRivets = function() {};

    return no.inherit(ViewRivets, View, {
        _init: function() {
            ViewPrototype._init.apply(this, arguments);

            this.on('ns-view-htmlinit', this._bindRivetsView);
            this.on('ns-view-htmldestroy', this._unbindRivetsView);
        },
        _bindRivetsView: function() {
            this._rivetsView = rivets.bind(this.node, {
                view: this,
                models: this.models
            });
        },
        _unbindRivetsView: function() {
            this._rivetsView.unbind();
        },
        invalidate: function(eventName, data) {
            var _invalidate = ViewPrototype.invalidate;

            /**
             * Checks whether given binding synchronizes DOM and model.
             * TODO: Check for the model, now checks only for keypath
             * matching.
             * @param  {Binding} binding
             * @return {Boolean}
             */
            var isMatchingBinding = function(binding) {
                // For `ns-model-changed` event, the second argument is
                // either the jpath that corresponds to the updated
                // attribute, or, in case of `ModelCollection`, an object
                // containing the information about updated child model.
                if (eventName === CHANGED_EVENT) {
                    var boundJpath = getJpathFromKeypath(binding.keypath);
                    var found = false;

                    if (typeof data === 'string') {
                        found = (boundJpath === data);
                    } else {
                        found = (boundJpath === data.jpath);
                    }

                    if (found) {
                        return true;
                    }

                    if (binding.iterated) {
                        return binding.iterated.some(function(view) {
                            return view.bindings.some(isMatchingBinding);
                        });
                    }
                }

                if (eventName === INSERT_EVENT || eventName === REMOVE_EVENT) {
                    return binding.keypath.indexOf(ITERATION_ADAPTER) !== -1;
                }
            };

            if (typeof eventName === 'string') {
                if (this._rivetsView.bindings.some(isMatchingBinding)) {
                    this.keepValid();
                } else {
                    _invalidate.apply(this, arguments);
                }

            // Unconditionally invalidate this view, when it is not invoked
            // as a model attribute change handler.
            } else {
                _invalidate.apply(this, arguments);
            }
        }
    });

}));
