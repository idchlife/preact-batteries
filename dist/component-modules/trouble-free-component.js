"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_system_1 = require("./module-system");
var ERROR_MESSAGE = "[CRITICAL ERROR]";
function renderFunction() {
    return ERROR_MESSAGE;
}
function onErrorFunc(e) {
    this.render = renderFunction;
    console.error("[preact-batteries.troube-free-component]: you had error in one of your methods in component.\n    You can distinguish one with error by looking at your interface. It should show " + ERROR_MESSAGE + ". Also, here is\n    error message. Logging error after this message.");
    console.error(e);
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
        module_system_1.listenMethodForErrors(c, "componentWillMount", onErrorFunc);
        module_system_1.listenMethodForErrors(c, "componentDidMount", onAppearedErrorFunc);
        module_system_1.listenMethodForErrors(c, "componentWillReceiveProps", onErrorFunc);
        module_system_1.listenMethodForErrors(c, "shouldComponentUpdate", onErrorFunc);
        module_system_1.listenMethodForErrors(c, "render", onAppearedErrorFunc);
    };
    return TroubleFreeComponent;
}());
exports.TroubleFreeComponent = TroubleFreeComponent;
