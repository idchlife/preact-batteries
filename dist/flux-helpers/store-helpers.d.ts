/// <reference types="node" />
import { EventEmitter } from "events";
import * as mitt from "mitt";
export declare class NodeEventsStore extends EventEmitter {
    addChangeListener(listener: Function): void;
    removeChangeListener(listener: Function): void;
    emitChange(): void;
}
export declare class MittStore {
    mitt: mitt.Emitter;
    addChangeListener(listener: Function): void;
    removeChangeListener(listener: Function): void;
    emitChange(): void;
}
