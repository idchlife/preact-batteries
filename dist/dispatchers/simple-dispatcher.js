"use strict";
exports.__esModule = true;
var Dispatcher = (function () {
    function Dispatcher() {
        this.callbacks = [];
    }
    Dispatcher.prototype.register = function (callback) {
        this.callbacks.push(callback);
    };
    Dispatcher.prototype.dispatch = function (payload) {
        this.callbacks.forEach(function (c) { return c(payload); });
    };
    return Dispatcher;
}());
exports["default"] = Dispatcher;
