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
var RenderMethodNotDefinedError = (function (_super) {
    __extends(RenderMethodNotDefinedError, _super);
    function RenderMethodNotDefinedError() {
        return _super.call(this, "[preact-batteries.trouble-free-component]: render method in your component is not defined") || this;
    }
    return RenderMethodNotDefinedError;
}(Error));
/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
function listenComponentMethodForErrors(context, methodName, onError) {
    var old = context[methodName];
    if (methodName === "render" && !old) {
        throw new RenderMethodNotDefinedError();
    }
    context[methodName] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            if (methodName === "render") {
                return old.call.apply(old, [context].concat(args));
            }
            old && old.call.apply(old, [context].concat(args));
        }
        catch (e) {
            if (onError) {
                onError.call(context, e);
            }
        }
    }.bind(context);
}
exports.listenComponentMethodForErrors = listenComponentMethodForErrors;
var ERROR_MESSAGE = "[CRITICAL ERROR]";
function renderFunction() {
    return ERROR_MESSAGE;
}
function onErrorFunc(e) {
    this.render = renderFunction;
    console.error("[preact-batteries.troube-free-component]: you had error in one of your methods in component.\n    You can distinguish one with error by looking at your interface. It should show " + ERROR_MESSAGE + ". Also, here is\n    error message. Logging error after this message.");
    if (e instanceof Error) {
        console.error(e.name, e.message, e.stack);
    }
    else {
        console.error(e);
    }
}
function onAppearedErrorFunc(e) {
    if (this.forceUpdate) {
        onErrorFunc.call(this, e);
        this.forceUpdate();
    }
    else {
        console.warn("[preact-batteries.trouble-free-component]: component did not have forceUpdate method,\n      and error appeared in the render method or didMount method. So error in the component cannot be shown in the interface.\n      Throwing error further.");
        throw e;
    }
}
var TroubleFreeComponent = (function () {
    function TroubleFreeComponent() {
    }
    TroubleFreeComponent.prototype.init = function (c) {
        listenComponentMethodForErrors(c, "componentWillMount", onErrorFunc);
        listenComponentMethodForErrors(c, "componentDidMount", onAppearedErrorFunc);
        listenComponentMethodForErrors(c, "componentWillReceiveProps", onErrorFunc);
        listenComponentMethodForErrors(c, "shouldComponentUpdate", onErrorFunc);
        listenComponentMethodForErrors(c, "render", onAppearedErrorFunc);
    };
    return TroubleFreeComponent;
}());
exports.TroubleFreeComponent = TroubleFreeComponent;
