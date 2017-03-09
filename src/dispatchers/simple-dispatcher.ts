class Dispatcher {
  callbacks = [];

  register(callback: (payload: any) => void) {
    this.callbacks.push(callback);
  }

  dispatch(payload: any) {
    this.callbacks.forEach(c => c(payload));
  }
}

export default Dispatcher;