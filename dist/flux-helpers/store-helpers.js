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
var events_1 = require("events");
var mitt = require("mitt");
var CHANGE_EVENT = "CHANGE_EVENT_asm_821";
var NodeEventsStore = (function (_super) {
    __extends(NodeEventsStore, _super);
    function NodeEventsStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeEventsStore.prototype.addChangeListener = function (listener) {
        this.addListener(CHANGE_EVENT, listener);
    };
    NodeEventsStore.prototype.removeChangeListener = function (listener) {
        this.removeListener(CHANGE_EVENT, listener);
    };
    NodeEventsStore.prototype.emitChange = function () {
        this.emit(CHANGE_EVENT);
    };
    return NodeEventsStore;
}(events_1.EventEmitter));
exports.NodeEventsStore = NodeEventsStore;
var MittStore = (function () {
    function MittStore() {
        this.mitt = new mitt();
    }
    MittStore.prototype.addChangeListener = function (listener) {
        this.mitt.on(CHANGE_EVENT, listener);
    };
    MittStore.prototype.removeChangeListener = function (listener) {
        this.mitt.off(CHANGE_EVENT, listener);
    };
    MittStore.prototype.emitChange = function () {
        this.mitt.emit(CHANGE_EVENT);
    };
    return MittStore;
}());
exports.MittStore = MittStore;
