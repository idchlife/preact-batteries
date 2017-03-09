"use strict";
exports.__esModule = true;
function modules(component, modules) {
    if (modules === void 0) { modules = []; }
    modules.forEach(function (m) { return m.init(component); });
}
exports.modules = modules;
