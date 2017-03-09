declare module 'preact-batteries/component-modules/module-system' {
	export interface ComponentModule<ComponentType> {
	    init(c: ComponentType): void;
	}
	export interface CompatibleComponentInterface<PropsType, StateType> {
	    state: Object;
	    render(props: PropsType, state: StateType): any;
	    setState(state: Object): any;
	    componentWillMount?(): void;
	    componentWillUnmount?(): void;
	}
	export function modules<ComponentType>(component: ComponentType, modules?: Array<ComponentModule<ComponentType>>): void;

}
declare module 'preact-batteries/component-modules/auth-dependent-component' {
	import { CompatibleComponentInterface, ComponentModule } from 'preact-batteries/component-modules/module-system';
	export interface StoreInterface {
	    addChangeListener(listener: Function): any;
	    removeChangeListener(listener: Function): any;
	}
	export interface AuthenticationStoreInterface extends StoreInterface {
	    checkingAuthenticationStatus(): boolean;
	    isAuthenticated(): boolean;
	}
	export interface AuthModuleContructorObject {
	    store: AuthenticationStoreInterface;
	    needsAuth: boolean;
	    authCheckInProcessRenderReturn: any;
	    authStatusNotAllowedCallback: Function;
	    authStatusNotAllowedRenderReturn: any;
	}
	export class AuthDependentComponent implements AuthModuleContructorObject, ComponentModule<CompatibleComponentInterface<any, any>> {
	    store: AuthenticationStoreInterface;
	    needsAuth: boolean;
	    authCheckInProcessRenderReturn: any;
	    authStatusNotAllowedCallback: any;
	    authStatusNotAllowedRenderReturn: any;
	    /**
	     * isUserAuthenticated - promise that returns, whether user is authenticated;
	     * async because we don't know and don't want to stop main UI thread when
	     * checking for authentication
	     *
	     * needsAuth - needs this component authentication, or not
	     */
	    constructor(params: AuthModuleContructorObject);
	    init(c: CompatibleComponentInterface<any, any>): void;
	}

}
declare module 'preact-batteries/index' {
	export { AuthDependentComponent, AuthenticationStoreInterface } from 'preact-batteries/component-modules/auth-dependent-component';
	export { modules, CompatibleComponentInterface, ComponentModule } from 'preact-batteries/component-modules/module-system';
}
