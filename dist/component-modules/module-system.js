"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
function listenMethodForErrors(context, methodName, onError) {
    var old = context[methodName];
    context[methodName] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            old && old.call.apply(old, [context].concat(args));
        }
        catch (e) {
            if (onError) {
                onError.call(context, e);
            }
        }
    }.bind(context);
}
exports.listenMethodForErrors = listenMethodForErrors;
function modules(component, modules) {
    if (modules === void 0) { modules = []; }
    modules.forEach(function (m) { return m.init(component); });
}
exports.modules = modules;
