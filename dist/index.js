(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./component-modules/auth-dependent-component", "./component-modules/module-system", "./dispatchers/simple-dispatcher"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var auth_dependent_component_1 = require("./component-modules/auth-dependent-component");
    exports.AuthDependentComponent = auth_dependent_component_1.AuthDependentComponent;
    var module_system_1 = require("./component-modules/module-system");
    exports.modules = module_system_1.modules;
    var simple_dispatcher_1 = require("./dispatchers/simple-dispatcher");
    exports.SimpleDispatcher = simple_dispatcher_1.default;
});
