export interface ComponentModule<ComponentType> {
  init(c: ComponentType): void;
}

export interface CompatibleComponentInterface<PropsType, StateType> {
  state: Object;
  render(props: PropsType, state: StateType): any;
  setState(state: Object);
  componentWillMount?(): void;
  componentWillUnmount?(): void;
  forceUpdate?(): void;
}

/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
export function listenMethodForErrors(
  context,
  methodName: string,
  onError?: (e: Error) => void
) {
  const old: Function | undefined = context[methodName];

  context[methodName] = function(...args) {
    try {
      old.call(context, ...args);
    } catch (e) {
      if (onError) {
        onError.call(context, e);
      }
    }
  }.bind(context);
}

export function modules<ComponentType>(
  component: ComponentType,
  modules: Array<ComponentModule<ComponentType>> = []
) {
  modules.forEach(m => m.init(component));
}