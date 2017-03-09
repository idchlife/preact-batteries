export interface ComponentModule<ComponentType> {
  init(c: ComponentType): void;
}

export interface CompatibleComponentInterface<PropsType, StateType> {
  state: Object;
  render(props: PropsType, state: StateType): any;
  setState(state: Object);
  componentWillMount?(): void;
  componentWillUnmount?(): void;
}

export function modules<ComponentType>(
  component: ComponentType,
  modules: Array<ComponentModule<ComponentType>> = []
) {
  modules.forEach(m => m.init(component));
}