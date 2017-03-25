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
/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
export declare function listenMethodForErrors(context: any, methodName: string, onError?: (e: Error) => void): void;
export declare function modules<ComponentType>(component: ComponentType, modules?: Array<ComponentModule<ComponentType>>): void;
