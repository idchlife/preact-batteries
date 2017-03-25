export interface ComponentModule<ComponentType> {
    init(c: ComponentType): void;
}
export interface CompatibleComponentInterface<PropsType, StateType> {
    state: Object;
    render(props: PropsType, state: StateType): any;
    setState(state: Object): any;
    componentWillMount?(): void;
    componentWillUnmount?(): void;
    forceUpdate?(): void;
}
export declare function modules<ComponentType>(component: ComponentType, modules?: Array<ComponentModule<ComponentType>>): void;
