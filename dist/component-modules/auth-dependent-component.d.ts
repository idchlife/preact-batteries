import { CompatibleComponentInterface, ComponentModule } from "./module-system";
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
export declare class AuthDependentComponent implements AuthModuleContructorObject, ComponentModule<CompatibleComponentInterface<any, any>> {
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
