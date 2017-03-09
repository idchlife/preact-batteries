(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = Dispatcher;
});
