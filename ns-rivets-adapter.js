(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['noscript', 'rivets', 'nommon'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('noscript'), require('rivets'));
    } else {
        ns.ViewRivets = factory(root.ns, root.rivets);
    }
}(this, function (ns, rivets) {

    var View = ns.View;

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

    rivets.configure({
        handler: function(target, event, binding) {
            this.call(binding.model, event, binding);
        }
    });

    /**
     * Subscribes to model attribute update.
     */
    rivets.adapters[':'] = {
        subscribe: function(obj, keypath, callback) {
            if (isModel(obj)) {
                obj.on('ns-model-changed.' + keypath, callback);
            }
        },
        unsubscribe: function(obj, keypath, callback) {
            if (isModel(obj)) {
                obj.off('ns-model-changed.' + keypath, callback);
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
    rivets.adapters['*'] = {
        subscribe: function(obj, keypath, callback) {
            if (isCollection(obj)) {
                obj.on('ns-model-insert', callback);
                obj.on('ns-model-remove', callback);
            }
        },
        unsubscribe: function(obj, keypath, callback) {
            if (isCollection(obj)) {
                obj.off('ns-model-insert', callback);
                obj.off('ns-model-remove', callback);
            }
        },
        read: function(obj, keypath) {
            if (isCollection(obj)) {
                return obj.models;
            }
        }
    };

    var ViewRivets = function() {};

    return no.inherit(ViewRivets, View, {
        _init: function() {
            View.prototype._init.apply(this, arguments);

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
        }
    });

}));
