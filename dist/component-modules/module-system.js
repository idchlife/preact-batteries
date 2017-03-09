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
    function modules(component, modules) {
        if (modules === void 0) { modules = []; }
        modules.forEach(function (m) { return m.init(component); });
    }
    exports.modules = modules;
});
