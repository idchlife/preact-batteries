import { EventEmitter } from "events";
import * as mitt from "mitt";

const CHANGE_EVENT = "CHANGE_EVENT_asm_821";

export class NodeEventsStore extends EventEmitter {
  addChangeListener(listener: Function) {
    this.addListener(CHANGE_EVENT, listener);
  }

  removeChangeListener(listener: Function) {
    this.removeListener(CHANGE_EVENT, listener);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

export class MittStore {
  mitt: mitt.Emitter = new mitt();

  addChangeListener(listener: Function) {
    this.mitt.on(CHANGE_EVENT, listener as mitt.Handler);
  }

  removeChangeListener(listener: Function) {
    this.mitt.off(CHANGE_EVENT, listener as mitt.Handler);
  }

  emitChange() {
    this.mitt.emit(CHANGE_EVENT);
  }
}