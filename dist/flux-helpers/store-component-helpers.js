"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PropertyGetterUndefinedError = (function (_super) {
    __extends(PropertyGetterUndefinedError, _super);
    function PropertyGetterUndefinedError(property) {
        return _super.call(this, "[StoreListener]: property " + property + " does not have valid\n       getter method or public availability in the store") || this;
    }
    return PropertyGetterUndefinedError;
}(Error));
exports.PropertyGetterUndefinedError = PropertyGetterUndefinedError;
var StoreListener = (function () {
    function StoreListener(c, s) {
        this.propertiesGetters = [];
        this.store = s;
        this.component = c;
    }
    StoreListener.prototype.add = function (property, customGetterName, onAfterGetCallback) {
        if (customGetterName === void 0) { customGetterName = undefined; }
        if (onAfterGetCallback === void 0) { onAfterGetCallback = undefined; }
        this.getPropertyFromStore(property, customGetterName, true);
        this.propertiesGetters.push({
            property: property,
            customGetterName: customGetterName,
            onAfterGetCallback: onAfterGetCallback
        });
        return this;
    };
    StoreListener.prototype.listen = function () {
        var c = this.component;
        var oldComponentWillMount = c.componentWillMount;
        var store = this.store;
        var propertiesGetters = this.propertiesGetters;
        var getPropertyFromStore = this.getPropertyFromStore.bind(this);
        var changeListener = function changeListener() {
            var newState = {};
            propertiesGetters.forEach(function (p) {
                newState[p.property] = getPropertyFromStore(p.property, p.customGetterName);
            });
            this.setState(newState);
        }.bind(c);
        c.componentWillMount = function () {
            store.addChangeListener(changeListener);
            oldComponentWillMount.call(this);
        }.bind(c);
        var oldComponentWillUnmount = c.componentWillUnmount;
        store.removeChangeListener(changeListener);
        c.componentWillUnmount = function () {
            store.removeChangeListener(changeListener);
            oldComponentWillUnmount.call(this);
        }.bind(c);
    };
    StoreListener.prototype.getPropertyFromStore = function (property, customGetter, onlyCheckAvailability) {
        if (customGetter === void 0) { customGetter = undefined; }
        if (onlyCheckAvailability === void 0) { onlyCheckAvailability = false; }
        if (customGetter) {
            if (typeof this.store[customGetter] === "undefined") {
                throw new PropertyGetterUndefinedError(property);
            }
            if (!onlyCheckAvailability) {
                return this.store[customGetter];
            }
        }
        var getterMethod = "get" + property.charAt(0).toUpperCase() + property.slice(1);
        var stateProperty = (this.store.getState
            && typeof this.store.getState === "function"
            && typeof this.store.getState() === "object"
            && this.store.getState().hasOwnProperty(property)) ? true : false;
        if (typeof this.store[property] === "undefined"
            &&
                typeof this.store[getterMethod] === "undefined"
            &&
                !stateProperty) {
            throw new PropertyGetterUndefinedError(property);
        }
        if (!onlyCheckAvailability) {
            if (stateProperty) {
                var state = this.store.getState();
                return state[property];
            }
            return this.store[property] ? this.store[property] : this.store[getterMethod];
        }
    };
    return StoreListener;
}());
exports.StoreListener = StoreListener;
